import { BeforeInsert, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class DateAudit {
  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date;
}