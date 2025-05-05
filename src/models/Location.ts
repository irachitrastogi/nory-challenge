import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  active: boolean;
}
