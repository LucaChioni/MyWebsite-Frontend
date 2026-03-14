import "../base.js";
import "../i18n/pages/interests.js";


const imgMusicOff = "/images/icons/music_off.png";
const imgMusicOn = "/images/icons/music_on.png";

const audio_the_last_of_us = document.getElementById("bg-music-the-last-of-us");
const audio_outer_wilds = document.getElementById("bg-music-outer-wilds");
const audio_to_the_moon = document.getElementById("bg-music-to-the-moon");
const audio_expedition_33 = document.getElementById("bg-music-expedition-33");

const toggle_the_last_of_us_desktop = document.getElementById("music-toggle-the-last-of-us-desktop");
const toggle_the_last_of_us_smartphone = document.getElementById("music-toggle-the-last-of-us-smartphone");
const toggle_outer_wilds_desktop = document.getElementById("music-toggle-outer-wilds-desktop");
const toggle_outer_wilds_smartphone = document.getElementById("music-toggle-outer-wilds-smartphone");
const toggle_to_the_moon = document.getElementById("music-toggle-to-the-moon");
const toggle_expedition_33 = document.getElementById("music-toggle-expedition-33");

const stopEverything = (exception=false) => {
    audio_the_last_of_us.pause();
    if (exception != "the_last_of_us") audio_the_last_of_us.currentTime = 0;
    audio_outer_wilds.pause();
    if (exception != "outer_wilds") audio_outer_wilds.currentTime = 0;
    audio_to_the_moon.pause();
    if (exception != "to_the_moon") audio_to_the_moon.currentTime = 0;
    audio_expedition_33.pause();
    if (exception != "expedition_33") audio_expedition_33.currentTime = 0;
    toggle_the_last_of_us_desktop.src = imgMusicOff;
    toggle_the_last_of_us_smartphone.src = imgMusicOff;
    toggle_outer_wilds_desktop.src = imgMusicOff;
    toggle_outer_wilds_smartphone.src = imgMusicOff;
    toggle_to_the_moon.src = imgMusicOff;
    toggle_expedition_33.src = imgMusicOff;
}

toggle_the_last_of_us_desktop.addEventListener("click", () => {
    if (audio_the_last_of_us.paused) {
        stopEverything("the_last_of_us");
        audio_the_last_of_us.play();
        toggle_the_last_of_us_desktop.src = imgMusicOn;
        toggle_the_last_of_us_smartphone.src = imgMusicOn;
    } else {
        stopEverything("the_last_of_us");
    }
});
toggle_the_last_of_us_smartphone.addEventListener("click", () => {
    if (audio_the_last_of_us.paused) {
        stopEverything("the_last_of_us");
        audio_the_last_of_us.play();
        toggle_the_last_of_us_desktop.src = imgMusicOn;
        toggle_the_last_of_us_smartphone.src = imgMusicOn;
    } else {
        stopEverything("the_last_of_us");
    }
});

toggle_outer_wilds_desktop.addEventListener("click", () => {
    if (audio_outer_wilds.paused) {
        stopEverything("outer_wilds");
        audio_outer_wilds.play();
        toggle_outer_wilds_desktop.src = imgMusicOn;
        toggle_outer_wilds_smartphone.src = imgMusicOn;
    } else {
        stopEverything("outer_wilds");
    }
});
toggle_outer_wilds_smartphone.addEventListener("click", () => {
    if (audio_outer_wilds.paused) {
        stopEverything("outer_wilds");
        audio_outer_wilds.play();
        toggle_outer_wilds_desktop.src = imgMusicOn;
        toggle_outer_wilds_smartphone.src = imgMusicOn;
    } else {
        stopEverything("outer_wilds");
    }
});

toggle_to_the_moon.addEventListener("click", () => {
    if (audio_to_the_moon.paused) {
        stopEverything("to_the_moon");
        audio_to_the_moon.play();
        toggle_to_the_moon.src = imgMusicOn;
    } else {
        stopEverything("to_the_moon");
    }
});

toggle_expedition_33.addEventListener("click", () => {
    if (audio_expedition_33.paused) {
        stopEverything("expedition_33");
        audio_expedition_33.play();
        toggle_expedition_33.src = imgMusicOn;
    } else {
        stopEverything("expedition_33");
    }
});
