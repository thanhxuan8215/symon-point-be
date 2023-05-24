import { PrimaryGeneratedColumn } from "typeorm";
import { DateAudit } from "./date-audit";

export class BaseEntity extends DateAudit {
  @PrimaryGeneratedColumn("uuid")
  public id: string;
}