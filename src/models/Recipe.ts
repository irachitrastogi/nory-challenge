import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredient } from "./RecipeIngredient";

@Entity("recipes")
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.recipe)
  ingredients: RecipeIngredient[];
}
