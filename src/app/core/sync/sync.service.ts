export interface SyncEvent {
  id: string;
  entity: string; // e.g., 'TimeEntry' | 'CourseVisit'
  entityId: string;
  type: 'create' | 'update' | 'delete';
  payload?: any;
  createdAt: string;
  deviceId?: string;
  userId?: string;
}

export interface ISyncService {
  enqueueEvent(event: SyncEvent): Promise<void>;
  pushPendingEvents(): Promise<void>;
  pullServerEvents(since?: string): Promise<SyncEvent[]>;
  applyServerEvents(events: SyncEvent[]): Promise<void>;
}

export default ISyncService;
