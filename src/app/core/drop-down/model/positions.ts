import { IPosition } from '../api/position.interface';

export const POSITION_BOTTOM_CENTER: IPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top'
};

export const POSITION_BOTTOM_LEFT: IPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
};

export const POSITION_BOTTOM_RIGHT: IPosition = {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
};

export const POSITION_TOP_LEFT: IPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top'
};

export const POSITION_TOP_RIGHT: IPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top'
};

export const POSITION_TOP_CENTER: IPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top'
};
