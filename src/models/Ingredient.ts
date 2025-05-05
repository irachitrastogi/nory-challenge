import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("ingredients")
export class Ingredient {
  @PrimaryGeneratedColumn()
  ingredient_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  cost: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ default: true })
  active: boolean;
}
