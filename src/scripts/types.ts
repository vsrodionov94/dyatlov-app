enum ModalTypes {
  Tutorial,
  Lock,
  Radio,
  FileAnswer,
  FileSend,
};

type StateType = {
  tutorial: boolean;
  vkId: number;
  modal?: ModalTypes;
  keys: number;
  artifacts: number;
  invites: number;
  modalData?: ModalData;
};

type ModalData = RandomUserData
| TrySendUserData
| UserForAnswerData
| TryAnswerUserData
| CheckKeyData
| TryKeyData
| CheckAudioData
| TryAudioData;

type CheckUserData = {
  tutorial: boolean;
  keys: number;
  artifacts: number;
  inviteCount: number;
};

type GetData = { vkId: number, ref?: string };
type AnswerData = { vkId: number, answer: string };
type AnswerUserData = {  vkId: number; foreignId: number; helped: boolean; };
type UserData = {
  id: number;
  name: string;
  sex: string;
  age: string;
  photo: string;
};
type RandomUserData = { error: boolean; tryCount: number; user: UserData; };
type CheckKeyData = {
  error: boolean;
  tryCount: number;
  currentDay: number;
  hasKey: boolean;
};
type TryKeyData = {
  error: boolean;
  correctly: number;
  keys: number;
  tryCount: number;
};
type CheckAudioData = {
  error: boolean;
  tryCount: number;
  currentDay: number;
  hasAudio: boolean;
};
type TryAudioData = {
  error: boolean;
  correctly: number;
  artifacts: number;
  tryCount: number;
};
type UserForAnswerData = { error: boolean; tryCount: number; user: UserData; };
type TrySendUserData = { error: boolean; tryCount: number; artifacts: number; };
type TryAnswerUserData = { error: boolean; tryCount: number; artifacts: number; };

export {
  ModalTypes,
  StateType,
  GetData,
  AnswerData,
  AnswerUserData,
  RandomUserData,
  CheckKeyData,
  TryKeyData,
  CheckAudioData,
  TryAudioData,
  UserForAnswerData,
  TrySendUserData,
  TryAnswerUserData,
  CheckUserData,
  ModalData,
};