import { 
  SIMPLE_MAN_ARCHVIE_FB_PROJECT_ID, 
  SIMPLE_MAN_ARCHVIE_FB_CLIENT_EMAIL, 
  SIMPLE_MAN_ARCHVIE_FB_PRIVATE_KEY, 
  SIMPLE_MAN_ARCHIVE_STORAGE_BUCKET,
  RAICH_DESGINS_FB_PROJECT_ID,
  RAICH_DESGINS_FB_CLIENT_EMAIL,
  RAICH_DESGINS_FB_PRIVATE_KEY,
  RAICH_DESGINS_STORAGE_BUCKET,
} from "$env/static/private";

export const PROJECTS_KEYS: Record<string, Record<string, string>> = {
  'simple-man-archive': {
    'fb-project-id': SIMPLE_MAN_ARCHVIE_FB_PROJECT_ID,
    'fb-client-email': SIMPLE_MAN_ARCHVIE_FB_CLIENT_EMAIL,
    'fb-private-key': SIMPLE_MAN_ARCHVIE_FB_PRIVATE_KEY,
    'fb-storage-bucket': SIMPLE_MAN_ARCHIVE_STORAGE_BUCKET,
  },
  'raich-designs': {
    'fb-project-id': RAICH_DESGINS_FB_PROJECT_ID,
    'fb-client-email': RAICH_DESGINS_FB_CLIENT_EMAIL,
    'fb-private-key': RAICH_DESGINS_FB_PRIVATE_KEY,
    'fb-storage-bucket': RAICH_DESGINS_STORAGE_BUCKET,    
  }
}