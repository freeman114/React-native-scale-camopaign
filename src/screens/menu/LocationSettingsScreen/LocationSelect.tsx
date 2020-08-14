import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import { Sketch  } from 'expo-pixi';
import { apiGetLevelsRequest } from '../../../api/levels';
import { Button } from '../../../components/buttons';

interface LocationSelectProps {
 onLocationSelect(location): void;
 selectedId?: number;
}

interface NodeProps {
  level: number;
  title: string;
  isSelected: boolean;
  node: object;
  onSelect(node): void;
}

const NodeBase: React.FC<NodeProps> = ({ level, title, isSelected, node, onSelect }) => {
  return (
    <NestedRow
      level={level}
      paddingLeftIncrement={10}
      style={isSelected ? styles.selectedNode : styles.node}
    >
      <Text>{title}</Text>
      {isSelected ? null : <Button onPress={() => onSelect(node)} style={styles.button} title="Select"/>}
    </NestedRow>
  )
};

const Node = React.memo(NodeBase);

const LocationSelectBase: React.FC<LocationSelectProps> = (props) => {
  const { onLocationSelect, selectedId } = props;
  const [ levels, setLevels ] = useState(null);

  useEffect(() => {
    apiGetLevelsRequest(({ user_levels }) => setLevels(user_levels));
  }, []);

  return (
    <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
      {levels ? <NestedListView
        data={levels || []}
        getChildrenName={(node) => 'children'}
        keepOpenedState={true}
        renderNode={(node, level) => <Node
          level={level}
          title={`${node.children.length > 0 ? '>' : ''} ${node.title}`}
          node={node}
          onSelect={onLocationSelect}
          isSelected={node.id === selectedId}
        />}
      /> : <Text>Loading locations...</Text>}
    </View>
  )
};

export const LocationSelect = React.memo(LocationSelectBase);

const styles = StyleSheet.create({
  node: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectedNode: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    padding: 0,
    width: 100
  }
});