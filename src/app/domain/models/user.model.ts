export class User{
  constructor(
    private readonly _id: number,
    private readonly _fullname: string,
    private readonly _email: string,
    private readonly _is_active: boolean,
    private readonly _created_at: Date,
    private readonly _updated_at: Date,
  ){}

  get id(): number{
    return this._id;
  }

  get fullname(): string{
    return this._fullname;
  }

  get email(): string{
    return this._email;
  }

  get is_active(): boolean{
    return this._is_active;
  }

  get created_at(): Date{
    return this._created_at;
  }

  get updated_at(): Date{
    return this._updated_at;
  }
}
