import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    userName: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        nullable: false
    })
    email: string;

    @Column({
        nullable: true
    })
    firstName: string;

    @Column({
        nullable: true
    })
    lastName: string;

    @Column('datetime', {
        nullable: false
    })
    birthDate: Date;

    @Column('datetime', {
        nullable: false,
        default: () => "CURRENT_TIMESTAMP"
    })
    createDate: Date;

    @Column('datetime', {
        nullable: false,
        default: () => "CURRENT_TIMESTAMP"
    })
    updateDate: Date;

    @Column('datetime', {
        nullable: true
    })
    deletedDate: Date;

    @Column({
        nullable: true,
    })
    status: string;

}
