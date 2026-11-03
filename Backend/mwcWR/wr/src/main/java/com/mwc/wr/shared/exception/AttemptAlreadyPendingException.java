package com.mwc.wr.shared.exception;

public class AttemptAlreadyPendingException extends RuntimeException {
    public AttemptAlreadyPendingException(String message) {
        super(message);
    }
}
