declare namespace Actions {
  export interface IAction {
    handle(
      inputs?: Input[],
      options?: Input[],
      extraFlags?: string[]
    ): Promise<void>
  }
}

declare interface OpenIAction extends Actions.IAction {
  showTemplete(path?: string): Promise<void>
}
