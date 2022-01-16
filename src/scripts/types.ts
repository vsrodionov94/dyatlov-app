enum modalTypes {
  Tutorial,
  Lock,
  Radio,
  FileAnswer,
  FileSend,
};

type stateType = {
  tutorial: boolean;
  vkId: number;
  modal?: modalTypes;
  keys: number;
  artifacts: number;
  invites: number;
};


export {
  modalTypes,
  stateType,
};