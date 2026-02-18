import { log } from "console";
import { toast } from "sonner";
type Status = {status: "empty" | "processing" | "completed", isloading: boolean};
type Listener = (value: Status) => void;
class LandingService {
    public landingStatus: Status = {status: "empty", isloading: true};

  private listeners: Listener[] = [];
  private intervalId: number | null = null;
  public isLoading: boolean = false

  startLandingStatusPolling(
    api: { getPitchDetails: Function },
    pitchId: string | undefined
  ) {
    if (this.intervalId !== null) return; // prevent duplicates
    if(!pitchId) return;
    
    this.landingStatus={...this.landingStatus, isloading: true}
    // first call immediately
    this.landingPageStatus(api, pitchId);

    this.intervalId = window.setInterval(() => {
      this.landingPageStatus(api, pitchId);
    }, 10000);
  }

  stopLandingStatusPolling() {    
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async landingPageStatus(
    api: { getPitchDetails: Function },
    pitchId: string,
    isAfterCall?: boolean
  ) {
    this.landingStatus = {...this.landingStatus, isloading: true};
    const response = await api.getPitchDetails(pitchId);
    

    this.landingStatus = {status: response.data.landingPageStatus, isloading:false};
    this.notify();

    // stop when enabled
    
    if (this.landingStatus.status === "completed"|| (this.landingStatus.status === 'empty' && !isAfterCall)) {
      this.stopLandingStatusPolling();
    }
  }

  // ------------------------------------
  // Subscribe from components
  // ------------------------------------
  subscribe(cb: Listener) {
    this.listeners.push(cb);

    // send current value immediately
    cb(this.landingStatus);

    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.landingStatus));
    this.isLoading = false
  }
    async generateLandingPage(api: { generateLandingPage: Function, getPitchDetails: Function },pitchId: string, logoContent: string|null){
            try{
                this.landingStatus = {...this.landingStatus, status:'processing'}
          this.landingPageStatus(api, pitchId, true)
          const response = await api.generateLandingPage(
            pitchId,
            "premium",
            logoContent || undefined,
          );
            }catch (error: any) {
                this.landingStatus = {...this.landingStatus, status:'empty'}
                throw new Error(error)
              } 
              finally{
                this.stopLandingStatusPolling()
                this.landingStatus ={...this.landingStatus, status:'completed'}
              }
    }
   
  
    
}
  
export default new LandingService();