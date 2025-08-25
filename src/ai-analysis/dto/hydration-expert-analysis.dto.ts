import { ApiProperty } from '@nestjs/swagger';

export class HydrationExpertAnalysisDto {
  @ApiProperty()
  period: string;

  @ApiProperty()
  analysisType: string;

  @ApiProperty()
  expertAnalysis: {
    title: string;
    summary: string;
    detailedReport: string;
    keyInsights: string[];
    healthImpact: {
      weightManagement: string;
      muscleDevelopment: string;
      metabolism: string;
      energyLevels: string;
      skinHealth: string;
    };
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
    scientificEvidence: string[];
    nextSteps: string[];
  };

  @ApiProperty()
  dataSummary: {
    hydrationMetrics: any;
    profileMetrics: any;
    correlationData: any;
  };

  @ApiProperty()
  generatedAt: string;

  @ApiProperty()
  aiModel: string;
}
