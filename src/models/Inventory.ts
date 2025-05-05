import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { Location } from "./Location";
import { Ingredient } from "./Ingredient";

@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column()
  @Index()
  location_id: number;

  @Column()
  @Index()
  ingredient_id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location: Location;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: "ingredient_id" })
  ingredient: Ingredient;
}
