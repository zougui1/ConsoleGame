import { IChoice } from '../types';

export const getChoice = (choices: IChoice[], choice: string | IChoice): IChoice => {
  return typeof choice === 'string'
    ? choices.find(c => c.message = choice)
    : choice;
}

export const getChoiceMessage = (choice: string | IChoice): string => {
  return typeof choice === 'string'
    ? choice
    : choice.message;
}
