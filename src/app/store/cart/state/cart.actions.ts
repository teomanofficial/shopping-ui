export class GetCartItemList {
  static readonly type = "[Cart] Get Cart Item List"
}

export class CreateOrIncrementCartItem {
  static readonly type = "[Cart] Create Or Increment Cart Item";

  constructor(public readonly productId: string) {
  }
}

export class RemoveOrDecrementCartItem {
  static readonly type = "[Cart] Remove Or Decrement Cart Item";

  constructor(public readonly productId: string) {
  }
}

export class ClearCart {
  static readonly type = "[Cart] Clear Cart";
}
