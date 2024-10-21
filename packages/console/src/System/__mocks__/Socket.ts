export const startSocket = () => {
  // do nothing
};

export const getSocket = () => {
  return {
    on: () => 1,
    off: () => 1,
    emit: () => 1,
  };
};
