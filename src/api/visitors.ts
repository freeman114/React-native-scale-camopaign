import { apiCall } from './index';

export interface IProject {
  avatar: string;
  due_date: string;
  id: number;
  name: string;
  overview: string;
  start_date: string;
  status: number;
}

export const apiGetProjectsRequest = (onSuccess: (data: { projects: IProject[]}) => void, onError = (err) => {}) => {
  return apiCall('/api/visitor-projects', {}, onSuccess, onError);
};


export const apiGetProjectSurveyRequest = (projectId: number, onSuccess: () => void, onError = () => {}) => {
  const formData = new FormData();
  formData.append('project_id', projectId.toString());
  return apiCall('/api/visitor-projects/get_survey', formData, onSuccess, onError);
};


export const apiSaveProjectAnswersRequest = (projectId: number, questions: object, answers: object, onSuccess: () => void, onError = () => {}) => {
  const formData = new FormData();
  formData.append('project_id', projectId.toString());
  formData.append('question', JSON.stringify(questions));
  formData.append('answer', JSON.stringify(answers));
  return apiCall('/api/visitor_project_instances/create', formData, onSuccess, onError);
};