namespace PublicApi.Utilities
{
    public class ActionResult<TError, TResult>
        where TError : class
        where TResult : class
    {
        public TError Error { get; private set; }
        public TResult Result { get; private set; }
        public bool Success { get; private set; }

        private ActionResult(TError error, TResult result, bool success)
        {
            Error = error;
            Result = result;
            Success = success;
        }

        public static ActionResult<TError, TResult> CreateSuccess(TResult result)
        {
            return new ActionResult<TError, TResult>(null, result, true);
        }

        public static ActionResult<TError, TResult> CreateError(TError error)
        {
            return new ActionResult<TError, TResult>(error, null, false);
        }
    }

    public class ActionResult<TError>
    where TError : class
    {
        public TError Error { get; private set; }
        public bool Success { get; private set; }

        private ActionResult(TError error, bool success)
        {
            Error = error;
            Success = success;
        }

        public static ActionResult<TError> CreateSuccess()
        {
            return new ActionResult<TError>(null, true);
        }

        public static ActionResult<TError> CreateError(TError error)
        {
            return new ActionResult<TError>(error, false);
        }
    }
}
