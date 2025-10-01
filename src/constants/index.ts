export const LAPTOP_IMAGE_URL = "https://images.unsplash.com/photo-1590097520505-416422f07ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBwaXRjaCUyMGRlY2slMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU1MjQxMDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export interface StartupFormData {
  startupName: string;
  problem: string;
  audience: string;
  description: string;
  usp: string;
  email: string;
}

export const INITIAL_FORM_DATA: StartupFormData = {
  startupName: '',
  problem: '',
  audience: '',
  description: '',
  usp: '',
  email: ''
};