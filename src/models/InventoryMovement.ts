import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn } from "typeorm";
import { Location } from "./Location";
import { Staff } from "./Staff";
import { Ingredient } from "./Ingredient";

export enum MovementType {
  DELIVERY = "delivery",
  SALE = "sale",
  WASTE = "waste",
  ADJUSTMENT = "adjustment"
}

@Entity("inventory_movements")
export class InventoryMovement {
  @PrimaryGeneratedColumn()
  movement_id: number;

  @Column()
  @Index()
  location_id: number;

  @Column()
  @Index()
  staff_id: number;

  @Column()
  @Index()
  ingredient_id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  @Column({
    type: "varchar",
    enum: MovementType
  })
  type: MovementType;

  @Column({ type: "varchar", nullable: true })
  reference: string | null;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  cost: number | null;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  revenue: number | null;

  @Column({ type: "varchar", nullable: true })
  notes: string | null;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location: Location;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "staff_id" })
  staff: Staff;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: "ingredient_id" })
  ingredient: Ingredient;
}
