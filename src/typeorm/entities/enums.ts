export enum AddressType {
  Normal = 'normal',
  Master = 'master',
}

export enum ReceiveType {
  Store = 'store',
  Group = 'group',
}

export enum ReceiveStatus {
  Active = 'active',
  Cancel = 'cancel',
}

export enum SpentType {
  Exchange = 'exchange',
  Burn = 'burn',
}

export enum TransactionLogType {
  Submitted = 'submitted',
  Confirmed = 'confirmed',
  Failed = 'failed',
}

export enum PointLogType {
  Grant = 'grant',
  Attach = 'attach',
  Exchange = 'exchange',
  Cansel = 'cansel',
  Detach = 'detach',
  Init = 'init',
  Expired = 'expired',
  Sync = 'sync'
}

export enum TransactionType {
  Mint = 'mint',
  Burn = 'burn',
}

export enum TransactionStatus {
  Submitted = 'submitted',
  Confirmed = 'confirmed',
  Failed = 'failed',
}

export enum LevelType {
  Symon = 1,
  National = 2,
  Central = 3,
  LocalGovernment = 4,
  Commercials = 5,
  Store = 6,
}

export enum AppId {
  Kesennuma = 1,
  Manage = 2,
  Gotochi = 3,
  Kagoshima = 4,
  Kameiten = 999,
}
