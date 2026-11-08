package com.mwc.wr.shared.exception;

public class SelfReviewNotAllowedException extends RuntimeException {
    public SelfReviewNotAllowedException(String message) {
        super(message);
    }
}
