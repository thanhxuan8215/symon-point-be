
export { Address } from "./address.entity";
export { Group } from "./group";
export { Level } from "./level";
export { Member } from "./member";
export { Receive } from "./receive";
export { SpentDetail } from "./spent-detail";
export { Spent } from "./spent";
export { Store } from "./store";
export { TransactionLog } from "./transaction-log.entity";
export { Transaction } from "./transaction.entity";

const entities = [__dirname + '/*.entity{.ts,.js}'];

export default entities;