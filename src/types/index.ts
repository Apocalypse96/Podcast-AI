export interface PodcastFormData {
  topic: string;
  additionalInfo: string;
}

export interface PodcastState {
  script: string | null;
  audioUrl: string | null;
  isGeneratingScript: boolean;
  isGeneratingAudio: boolean;
  error: string | null;
}
