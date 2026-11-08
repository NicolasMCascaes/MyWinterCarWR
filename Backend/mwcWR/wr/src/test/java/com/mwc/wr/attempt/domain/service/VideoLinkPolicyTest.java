package com.mwc.wr.attempt.domain.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

class VideoLinkPolicyTest {

    @ParameterizedTest
    @ValueSource(strings = {
            "https://www.youtube.com/watch?v=abc123",
            "https://youtube.com/watch?v=abc123",
            "https://m.youtube.com/watch?v=abc123",
            "https://youtu.be/abc123",
            "https://WWW.YOUTUBE.COM/watch?v=abc123",
            "  https://youtu.be/abc123  ",
            "https://www.twitch.tv/videos/123456",
            "https://clips.twitch.tv/SomeClip",
            "http://www.twitch.tv/videos/123456" })
    void isAllowed_acceptsYoutubeAndTwitch(String link) {
        assertTrue(VideoLinkPolicy.isAllowed(link));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {
            "   ",
            "youtube.com/watch?v=abc123",
            "ftp://youtube.com/video",
            "https://example.com/video.mp4",
            "https://youtube.com.evil.com/watch?v=abc",
            "https://notyoutube.com/watch?v=abc",
            "https://vimeo.com/123",
            "javascript:alert(1)",
            "https://you tube.com/x" })
    void isAllowed_rejectsOtherLinks(String link) {
        assertFalse(VideoLinkPolicy.isAllowed(link));
    }
}
