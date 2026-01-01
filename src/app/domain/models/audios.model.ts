export class Audio {
  constructor(
    private readonly _id: number,
    private readonly _user_id: number,
    private readonly _campaign_id: number,
    private readonly _original_name: string,
    private readonly _original_path: string,
    private readonly _original_ext: string,
    private readonly _processed_path: string | null,
    private readonly _mime_type: string | null,
    private readonly _size_bytes: number | null,
    private readonly _status: string,
    private readonly _transcription: string | null,
    private readonly _duration_seconds: number | null,
    private readonly _cost: number | null,
    private readonly _error_message: string | null,
    private readonly _created_at: Date,
    private readonly _updated_at: Date | null
  ) {}

  get id(): number {
    return this._id;
  }

  get user_id(): number {
    return this._user_id;
  }

  get campaign_id(): number {
    return this._campaign_id;
  }

  get original_name(): string {
    return this._original_name;
  }

  get original_path(): string {
    return this._original_path;
  }

  get original_ext(): string {
    return this._original_ext;
  }

  get processed_path(): string | null {
    return this._processed_path;
  }

  get mime_type(): string | null {
    return this._mime_type;
  }

  get size_bytes(): number | null {
    return this._size_bytes;
  }

  get status(): string {
    return this._status;
  }

  get transcription(): string | null {
    return this._transcription;
  }

  get duration_seconds(): number | null {
    return this._duration_seconds;
  }

  get cost(): number | null {
    return this._cost;
  }

  get error_message(): string | null {
    return this._error_message;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date | null {
    return this._updated_at;
  }
}
