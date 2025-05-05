import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { Location } from "./Location";

@Entity("staff")
export class Staff {
  @PrimaryGeneratedColumn()
  staff_id: number;

  @Column()
  name: string;

  @Column()
  @Index()
  location_id: number;

  @Column({ nullable: true })
  role: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location: Location;
}
