import {
    SET_CHANGWATS,
    SET_AMPHOES,
    SET_TAMBONS
} from './types';

export const setChangwats = (changwats) => {
    return {
        type: SET_CHANGWATS,
        payload: changwats
    }
}

export const setAmphoes = (amphoes) => {
    return {
        type: SET_AMPHOES,
        payload: amphoes
    }
}

export const setTambons = (tambons) => {
    return {
        type: SET_TAMBONS,
        payload: tambons
    }
}