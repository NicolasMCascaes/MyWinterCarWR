package com.mwc.wr.shared.exception;

public class RequiredFieldException extends RuntimeException {
    public RequiredFieldException(String message) {
        super(message);
    }

}
