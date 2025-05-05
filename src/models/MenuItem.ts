import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { Recipe } from "./Recipe";
import { Location } from "./Location";

@Entity("menu_items")
export class MenuItem {
  @PrimaryGeneratedColumn()
  menu_item_id: number;

  @Column()
  @Index()
  location_id: number;

  @Column()
  @Index()
  recipe_id: number;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location: Location;

  @ManyToOne(() => Recipe)
  @JoinColumn({ name: "recipe_id" })
  recipe: Recipe;
}
