import { Application } from "express";

export interface Controller {
    initialize(application: Application): void;
}