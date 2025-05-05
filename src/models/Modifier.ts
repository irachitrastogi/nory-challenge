import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Modifier {
  @PrimaryColumn()
  modifier_id: number;

  @Column()
  name: string;

  @Column()
  option: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;
}
