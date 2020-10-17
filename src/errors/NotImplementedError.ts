export class NotImplementedError extends Error {

  constructor(functionName?: string) {
    if (functionName) {
      super(`The function "${functionName}" has not been implemented yet`);
    } else {
      super('This function has not been implemented yet');
    }
  }
}
