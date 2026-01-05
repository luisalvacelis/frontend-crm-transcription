export class Campaign{

  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _description: string | null,
    private readonly _created_at: Date,
    private readonly _updated_at: Date
  ){}

  get id(): number{
    return this._id;
  }

  get name(): string{
    return this._name;
  }

  get description(): string | null{
    return this._description;
  }

  get created_at(): Date{
    return this._created_at;
  }

  get updated_at(): Date{
    return this._updated_at;
  }
}

export class CampaignStats{
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _total_audios: number,
    private readonly _total_transcribed: number,
    private readonly _status: string,
    private readonly _uploaded: number,
    private readonly _queued: number,
    private readonly _processing: number,
    private readonly _done: number,
    private readonly _error: number,
    private readonly _total_cost: number,
    private readonly _total_duration_seconds: number,
    private readonly _created_at: Date,
    private readonly _updated_at: Date,
  ){}

  get id(): number{
    return this._id;
  }
  get name(): string{
    return this._name;
  }
  get description(): string{
    return this._description;
  }
  get total_audios(): number{
    return this._total_audios;
  }
  get total_transcribed(): number{
    return this._total_transcribed;
  }
  get status(): string{
    return this._status;
  }
  get uploaded(): number{
    return this._uploaded;
  }
  get queued(): number{
    return this._queued;
  }
  get processing(): number{
    return this._processing;
  }
  get done(): number{
    return this._done;
  }
  get error(): number{
    return this._error;
  }
  get total_cost(): number{
    return this._total_cost;
  }
  get total_duration_seconds(): number{
    return this._total_duration_seconds;
  }
  get created_at(): Date{
    return this._created_at;
  }
  get updated_at(): Date{
    return this._updated_at;
  }


}

export class CampaignTranscribeAll{

  constructor(
    private readonly _message: string,
    private readonly _campaign_id: number,
    private readonly _campaign_name: string,
    private readonly _total_audios: number,
    private readonly _provider: string
  ){}

  public get message(): string{
    return this._message;
  }
  public get campaign_id(): number{
    return this._campaign_id;
  }
  public get campaign_name(): string{
    return this._campaign_name;
  }
  public get total_audios(): number{
    return this._total_audios;
  }
  public get provider(): string{
    return this._provider;
  }
}
