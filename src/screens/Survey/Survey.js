import React, {Component} from 'react';
import {
  View,
  ViewPropTypes,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput, Button,
} from 'react-native';
import PropTypes from 'prop-types';
import {CheckBox} from 'react-native-elements';
import {SegmentedControls} from 'react-native-radio-buttons';
import {Sketch} from 'expo-pixi';
import * as FileSystem from 'expo-file-system';

import SelectionGroup, {SelectionHandler} from 'react-native-selection-group';
import {DefaultSignature} from "../menu/SignatureSettingsScreen/DefaultSignature";
import {apiGetUserRequest} from "../../api/user";
import SurveyRichEditor from "./RichEditor";

const staffSignatureId = 'staffSignature';

const GREEN = 'rgba(141,196,63,1)';
const PURPLE = 'rgba(108,48,237,1)';

export class Survey extends Component {
  static propTypes = {
    survey: PropTypes.arrayOf({
      questions: PropTypes.arrayOf(PropTypes.shape({
        questionType: PropTypes.string.isRequired,
        questionText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        questionId: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
          optionText: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }))
      }).isRequired)
    }).isRequired,
    onAnswerSubmitted: PropTypes.func,
    onSurveyFinished: PropTypes.func,
    selectionGroupContainerStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
  };

  scrollRef = null;

  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      answers: {},
      tempAnswers: {},
      scroll: true,
      staff: null,
    };
    this.selectionHandlers = {};
    this.signatureRefs = {};
    this.timeoutRef = null;
  }

  componentWillMount() {
    apiGetUserRequest((response) => {
      this.setState({ staff: response })
    });
  }


  updateAnswer = ({questionId, value}) => {
    const {answers} = this.state;
    answers[questionId] = value;
    this.setState({answers});
  };

  renderPreviousButton() {
    let {currentPageIndex} = this.state;
    return (
      this.renderPrevious(() => {
          currentPageIndex--;
          this.setState({currentPageIndex});
        }, (currentPageIndex !== 0)
      ));
  }

  questionsFromAnswers = () => {
    const {survey} = this.props;
    const questions = {};
    for (const page in survey) {
      for (const q in survey[page].questions) {
        const question = survey[page].questions[q];
        if (question.questionType !== 'Info') {
          questions[question.questionId] = question.questionText || question.questions;
        }
      }
    }
    return questions;
  };

  renderFinishOrNextButton() {
    const {answers} = this.state;
    let {currentPageIndex} = this.state;
    const {survey} = this.props;

    const currentPage = survey[currentPageIndex];

    const questionIds = currentPage.questions.map(q => q.questionId).filter(q => Boolean(q));

    let enabled = questionIds.reduce((prev, current) => {
      return (answers[current] === 0 || answers[current] === false || Boolean(answers[current])) && prev;
    }, true);

    if (currentPageIndex === this.props.survey.length - 1) {
      return (
        this.renderFinishedButton(() => {
          if (this.props.onAnswerSubmitted && answers) {
            this.props.onAnswerSubmitted(answers);
          }
          if (this.props.onSurveyFinished) {
            this.props.onSurveyFinished(this.questionsFromAnswers(answers), answers);
          }
        }, enabled));
    }
    return (
      this.renderNextButton(() => {
        if (this.props.onAnswerSubmitted && answers[currentPageIndex]) {
          this.props.onAnswerSubmitted(answers[currentPageIndex]);
        }
        currentPageIndex++;
        if (this.scrollRef) {
          this.scrollRef.scrollTo({x: 0, y: 0, animated: true});
        }
        this.setState({currentPageIndex});
      }, enabled)
    );
  }

  renderPrevious = (onPress, enabled) => {
    return (
      <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
        <Button
          color={GREEN}
          onPress={onPress}
          disabled={!enabled}
          backgroundColor={GREEN}
          title={'Previous'}
        />
      </View>
    );
  };

  renderQuestionText = (questionText) => {
    return (
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Text numLines={1} style={styles.questionText}>{questionText}</Text>
      </View>
    );
  };

  renderFinishedButton = (onPress, enabled) => {
    return (
      <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
        <Button
          title="Finished"
          onPress={onPress}
          disabled={!enabled}
          color={GREEN}
        />
      </View>
    );
  };

  renderNextButton = (onPress, enabled) => {
    return (
      <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
        <Button
          color={GREEN}
          onPress={onPress}
          disabled={!enabled}
          backgroundColor={GREEN}
          title="Next"
        />
      </View>
    );
  };

  renderNavButtons() {
    const {navButtonContainerStyle} = this.props;
    return (
      <View style={navButtonContainerStyle}>
        {this.renderPreviousButton && this.renderPreviousButton()}
        {this.renderFinishOrNextButton && this.renderFinishOrNextButton()}
      </View>
    );
  }

  renderSelectionGroup(question) {
    const {selectionGroupContainerStyle, containerStyle} = this.props;
    const {answers} = this.state;

    if (!this.selectionHandlers[question.questionId]) {
      this.selectionHandlers[question.questionId] = new SelectionHandler(question.questionSettings || {
        maxMultiSelect: 1,
        allowDeselect: true
      });
    }

    const defaultValue = question.questionSettings && question.questionSettings.defaultSelection;

    if (!answers[question.questionId] && (defaultValue || defaultValue === 0)) {
      setTimeout(() => this.updateAnswer({
        questionId: question.questionId,
        value: question.options[defaultValue].value
      }), 0);
    }

    const selectionHandler = this.selectionHandlers[question.questionId];

    return (
      <View style={containerStyle}>
        {this.renderQuestionText(question.questionText)}
        <SelectionGroup
          onPress={selectionHandler.selectionHandler}
          items={question.options}
          isSelected={selectionHandler.isSelected}
          renderContent={this.renderSelector}
          containerStyle={selectionGroupContainerStyle}
          onItemSelected={(item) => {
            this.updateAnswer({
              questionId: question.questionId,
              value: item.value,
            });
          }}
          onItemDeselected={() => {
            this.updateAnswer({
              questionId: question.questionId,
              value: null
            });
          }}
        />
      </View>
    );
  }

  renderSelector = (data, index, isSelected, onPress) => {
    return (
      <View
        key={`selection_button_view_${index}`}
        style={{ marginTop: 5, marginBottom: 5, justifyContent: 'flex-start' }}
      >
        <Button
          title={data.optionText}
          onPress={onPress}
          color={isSelected ? GREEN : PURPLE}
          style={isSelected ? { fontWeight: 'bold' } : {}}
          key={`button_${index}`}
        />
      </View>
    );
  };

  renderMultipleSelectionGroup(question) {
    const {selectionGroupContainerStyle, containerStyle} = this.props;
    const multiSelectMax = Number(question.questionSettings.maxMultiSelect);
    const {answers} = this.state;
    if (multiSelectMax === 1) {
      return this.renderSelectionGroup();
    }

    if (!this.selectionHandlers[question.questionId]) {
      this.selectionHandlers[question.questionId] = new SelectionHandler(question.questionSettings || {
        maxMultiSelect: 1,
        allowDeselect: true
      });
    }

    const defaultValue = question.questionSettings && question.questionSettings.defaultSelection;

    if (!answers[question.questionId] && defaultValue) {
      setTimeout(() => this.updateAnswer({
        questionId: question.questionId,
        value: question.options.filter((q, i) => defaultValue.includes(i)).map(q => q.value)
      }), 0);
    }

    const selectionHandler = this.selectionHandlers[question.questionId];

    return (
      <View style={containerStyle}>
        {this.renderQuestionText(question.questionText)}
        <SelectionGroup
          onPress={selectionHandler.selectionHandler}
          items={question.options}
          isSelected={selectionHandler.isSelected}
          getAllSelectedItemIndexes={selectionHandler.getAllSelectedItemIndexes}
          renderContent={this.renderSelector}
          containerStyle={selectionGroupContainerStyle}
          onItemSelected={(item, allSelectedItems) => {
            this.updateAnswer({
              questionId: question.questionId,
              value: allSelectedItems.map(i => i.value)
            });
          }}
          onItemDeselected={(item, allSelectedItems) => {
            this.updateAnswer({
              questionId: question.questionId,
              value: allSelectedItems.length > 0 ? allSelectedItems.map(i => i.value) : null
            });
          }}
        />
      </View>
    );
  }

  renderNumeric(question) {
    const {containerStyle} = this.props;
    const answers = this.state.answers;
    const {allowDecimal, questionText, questionId, placeholderText = null, defaultValue = '', maxDigitsAfterDot} = question;

    if (answers[question.questionId] === undefined && (defaultValue || defaultValue === 0) && (allowDecimal || Number.isInteger(parseInt(`${defaultValue}`, 10)))) {
      setTimeout(() => this.updateAnswer({
        questionId: question.questionId,
        value: allowDecimal ? parseFloat(defaultValue) : parseInt(defaultValue)
      }), 0);
    }

    return (
      <View style={containerStyle}>
        {this.renderQuestionText(questionText)}
        {this.renderNumericInput(
          (value) => {
            let val = value;

            if (allowDecimal) {
              if (value.endsWith(',') || value.endsWith('.')) {
                val = value.replace(',', '.');
              }

              if (maxDigitsAfterDot) {
                const parts = val.split('.');
                const index = val.indexOf('.');
                val = (parts.length > 1 && parts[1].length > maxDigitsAfterDot) ? val.slice(0, index + maxDigitsAfterDot + 1) : val;
              }
            }
            else {
              val = val === '' ? '' : parseInt(value, 10);
            }

            this.updateAnswer({
              questionId,
              value: val
            });
          },
          answers[questionId] === undefined ? '' : answers[questionId],
          placeholderText,
        )}
      </View>
    );
  }

  renderPhoneInput = (question) => {
    const {containerStyle} = this.props;
    const answers = this.state.answers;
    const {questionText, questionId, placeholderText, maxLength} = question;

    return (
      <View style={containerStyle}>
        {this.renderQuestionText(questionText)}
        <TextInput
          style={styles.numericInput}
          onChangeText={value => {
            this.updateAnswer({
              questionId,
              value
            });
          }}
          maxLength={maxLength || 15}
          underlineColorAndroid={'white'}
          placeholderTextColor={'rgba(184,184,184,1)'}
          value={String(answers[questionId] === undefined ? '' : answers[questionId])}
          placeholder={placeholderText}
          keyboardType="phone-pad"
        />
      </View>);
  };


  renderTextInputElement(question) {
    const answers = this.state.answers;
    const {questionText, questionId, placeholderText = null, defaultValue} = question;
    if (answers[question.questionId] === undefined && defaultValue) {
      setTimeout(() => this.updateAnswer({
        questionId: question.questionId,
        value: defaultValue
      }), 0);
    }

    return (<View>
        {this.renderQuestionText(questionText)}
        {this.renderTextInput((value) =>
            this.updateAnswer({
              questionId,
              value
            }),
          answers[question.questionId] === undefined ? undefined : answers[question.questionId],
          placeholderText,
        )}
      </View>
    );
  }

  renderCheckBox(question) {
    const answers = this.state.answers;
    const {questionText, defaultValue, required} = question;
    if (answers[question.questionId] === undefined) {
      setTimeout(() => this.updateAnswer({
        questionId: question.questionId,
        value: defaultValue || (required ? null : false)
      }), 0);
    }

    return (<View>
        <CheckBox
          containerStyle={styles.checkBoxContainer}
          title={this.renderQuestionText(questionText)}
          checked={answers[question.questionId]}
          onPress={() => this.updateAnswer({
            questionId: question.questionId,
            value: !answers[question.questionId] ? true : required ? null : false
          })}
        />
      </View>
    );
  }

  clearCanvas = (questionId) => {
    this.signatureRefs[questionId].undo()
  };

  renderSignature = (question) => {
    const {placeholder, questionId, questionText} = question;
    const answers = this.state.answers;
    const tempAnswers = this.state.tempAnswers[questionId];
    const isStaffSignature = questionId === staffSignatureId;
    const { first_name, last_name } = this.state.staff;

    const name = tempAnswers
      ? tempAnswers.name
      : isStaffSignature
        ? `${first_name || ''} ${last_name || ''}`
        : '';

    const signature = tempAnswers ? tempAnswers.signature : undefined;

    const setAnswer = ({newName, newSignature}) => {
      this.setState({
        tempAnswers: {
          ...this.state.tempAnswers,
          [questionId]: {
            name: newName,
            signature: newSignature,
          }
        }
      });
      if (newName && newSignature) {
        this.updateAnswer({
          questionId,
          value: {
            name: newName,
            signature: newSignature
          }
        })
      } else {
        this.updateAnswer({
          questionId,
          value: undefined,
        });
      }
    };

    const currentName = answers[questionId] === undefined
      ? tempAnswers && tempAnswers.name
      : answers[questionId].name;

    const onSignatureChange = (signature) => setAnswer({newName: name, newSignature: signature});

    return (<View>
        {this.renderQuestionText(questionText)}
        {this.renderTextInput(
          (value) => setAnswer({
            newName: value.replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
            newSignature: signature
          }),
          currentName,
          placeholder,
          null,
          isStaffSignature
        )}
        {isStaffSignature ? (
          <DefaultSignature
            onScrollChange={(scroll) => scroll ? this.enableScroll() : this.disableScroll()}
            onSignatureChange={onSignatureChange}
            onDefaultSignatureLoaded={onSignatureChange}
          />
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Sketch
              style={styles.sketch}
              ref={(ref) => this.signatureRefs[questionId] = ref}
              strokeWidth={3}
              strokeAlpha={0.5}
              onChange={async () => {
                this.disableScroll();
                this.timeoutRef = setTimeout(() => {
                  this.enableScroll();
                  clearTimeout(this.timeoutRef);
                }, 1800);
                const {uri} = await this.signatureRefs[questionId].takeSnapshotAsync({
                  format: 'png',
                });
                try {
                  const signature = await FileSystem.readAsStringAsync(uri, {
                    encoding: 'base64',
                  });
                  setAnswer({newName: name, newSignature: signature});
                } catch (e) {
                  console.error(e.message);
                }
              }}
            />
            <TouchableOpacity onPress={() => this.clearCanvas(questionId)} style={{padding: 10}}>
              <Text style={{fontSize: 13, color: 'blue'}}>Undo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  renderInfo = (question) => {
    const {questionText} = question;

    return (
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Text style={styles.infoText}>{questionText}</Text>
      </View>
    );
  };

  renderNumericInput = (onChange, value, placeholder, onBlur) => {
    return (<TextInput
      style={styles.numericInput}
      onChangeText={text => { onChange(text); }}
      underlineColorAndroid={'white'}
      placeholderTextColor={'rgba(184,184,184,1)'}
      value={String(value)}
      placeholder={placeholder}
      autoCapitalize="words"
      keyboardType="decimal-pad"
      onBlur={onBlur}
    />);
  };

  renderTextInput = (onChange, value, placeholder, onBlur, disabled) => {
    return (
      <View>
        <TextInput
          style={styles.textBox}
          onChangeText={text => onChange(text)}
          numberOfLines={1}
          underlineColorAndroid={'white'}
          placeholder={placeholder}
          placeholderTextColor={'rgba(184,184,184,1)'}
          value={value}
          multiline
          onBlur={onBlur}
          editable={!disabled}
          blurOnSubmit
          returnKeyType='done'
        />
      </View>
    );
  };

  renderRichEditor = (question) => {
    const { placeholder, questionId } = question;
    return <SurveyRichEditor
      onChange={(html) => {
        this.updateAnswer({
          questionId,
          value: html,
        });
      }}
      placeholder={placeholder}
    />
  };

  renderAgreementInput(question) {
    const {questions, defaultValue} = question;
    const options = ['Yes', 'No', 'Unknown'];
    const defaultAnswers = this.state.answers[question.questionId];
    const answers = defaultAnswers || this.state.tempAnswers[question.questionId] || new Array(questions.length);

    if (!defaultAnswers && defaultValue && options.indexOf(defaultValue) !== -1) {
      this.updateAnswer({
        questionId: question.questionId,
        value: (new Array(questions.length)).fill(defaultValue)
      });
    }

    return (<View>
        {questions.map((q, i) => (
          <View>
            <Text style={styles.text}>{q}</Text>
            <SegmentedControls
              options={options}
              {...(answers ? {selectedOption: answers[i]} : {})}
              onSelection={(value) => {
                answers[i] = value;
                if (answers.filter(a => Boolean(a)).length === questions.length) {
                  this.updateAnswer({
                    questionId: question.questionId,
                    value: answers
                  })
                } else {
                  this.setState({
                    tempAnswers: {
                      ...this.state.tempAnswers,
                      [question.questionId]: answers
                    }
                  })
                }
              }}
            />
          </View>
        ))}
      </View>
    );
  }


  renderQuestion(question) {
    switch (question.questionType) {
      case 'GroupAgreementInput':
        return this.renderAgreementInput(question);
      case 'SelectionGroup':
        return this.renderSelectionGroup(question);
      case 'MultipleSelectionGroup':
        return this.renderMultipleSelectionGroup(question);
      case 'TextInput':
        return this.renderTextInputElement(question);
      case 'NumericInput':
        return this.renderNumeric(question);
      case 'Info':
        return this.renderInfo(question);
      case 'CheckBox':
        return this.renderCheckBox(question);
      case 'Signature':
        return this.renderSignature(question);
      case 'PhoneNumber':
        return this.renderPhoneInput(question);
      case 'RichEditor':
        return this.renderRichEditor(question);
      default:
        return <View/>;
    }
  }

  enableScroll = () => {
    if (!this.state.scroll) {
      this.setState({ scroll: true });
    }
  };

  disableScroll = () => {
    if (this.state.scroll) {
      this.setState({ scroll: false });
    }
  };

  renderPage(page) {
    if (page.disableScroll) {
      return (
        <View>
          {page.questions.map(q => this.renderQuestion(q))}
          {this.renderNavButtons()}
        </View>
      )
    }

    return (
      <ScrollView
        scrollEnabled={page.disableScroll ? false : this.state.scroll}
        ref={r => this.scrollRef = r}
        style={styles.container}
        onContentSizeChange={() => {
          this.scrollRef.scrollTo({x: 0, y: 0, animated: true});
        }}
      >
        {page.questions.map(q => this.renderQuestion(q))}
        {this.renderNavButtons()}
      </ScrollView>
    )
  }

  render() {
    const survey = this.props.survey;
    if (!this.state.staff) {
      return null;
    }
    return this.renderPage(survey[this.state.currentPageIndex]);
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'blue',
    marginBottom: 10
  },
  checkBoxContainer: {
    maxWidth: '85%',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingVertical: 0
  },
  sketch: {
    width: '70%',
    height: 150,
    borderColor: 'blue',
    borderWidth: 1,
    margin: 10
  },
  numericInput: {
    borderWidth: 1,
    borderColor: 'rgba(204,204,204,1)',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginLeft: 10,
    marginRight: 10
  },
  questionText: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 15,
    color: 'blue'
  },
  textBox: {
    borderWidth: 1,
    borderColor: 'rgba(204,204,204,1)',
    backgroundColor: 'white',
    borderRadius: 10,

    padding: 10,
    textAlignVertical: 'top',
    marginLeft: 10,
    marginRight: 10
  },
  infoText: {
    marginBottom: 20,
    fontSize: 15,
    marginLeft: 10,
    color: 'blue'
  },
  container: {marginTop: 20, paddingBottom: 60, paddingHorizontal: 20}
});

