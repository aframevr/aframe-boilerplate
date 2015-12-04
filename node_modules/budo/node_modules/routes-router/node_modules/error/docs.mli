type OptionError<T> := {
    option?: T,
    message: String,
    type: "OptionError"
}

type TypedError<T> := {
    message: String,
    type: T
}

type ValidationError := {
    errors: Array<Error>,
    message: String,
    type: "ValidationError"
}

error/option := (String, T) => OptionError<T>
error/typed := ({
    message: String,
    type: String
}) => (...args: Any) => TypedError<String>
error/validation := (Array<Error>) => ValidationError
