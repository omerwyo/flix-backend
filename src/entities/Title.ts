import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { Credit } from "./Credit";

@Entity()
export class Title {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  release_year: number;

  @Column()
  age_certification: string;

  @Column()
  runtime: number;

  @Column("text", {array: true})
  genres: string[];

  @Column()
  production_countries: string;

  @Column()
  seasons: number;

  @Column()
  imdb_id: number;

  @Column()
  imdb_score: number;

  @Column()
  imdb_votes: number;

  @Column({type: "decimal"})
  tmdb_popularity: number;

  @Column()
  tmdb_score: number;

  @OneToMany(type => Credit, credit => credit.id) credits: Credit[]
}