import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DistributionInfoStepProps {
  formData: {
    distributionType?: 'online' | 'physical';
    numberOfTotes?: number;
    distributionPoints: string[];
    distributionStartDate: Date | undefined;
    distributionEndDate: Date | undefined;
    demographics: {
      ageGroups: string[];
      income: string;
      education: string;
      other: string;
    };
  };
  updateFormData: (data: Partial<any>) => void;
}

// Location data for physical distribution
const locationData = {
  malls: [
    "GVK One Mall",
    "Inorbit Mall Hyderabad",
    "Hyderabad Central",
    "Forum Sujana Mall",
    "Manjeera Mall",
    "City Center Mall",
    "Sarath City Capital Mall",
    "Nexus Hyderabad",
    "GSM Mall",
    "Hyderabad Next Galleria Mall"
  ],
  metroStations: [
    "Ameerpet",
    "Miyapur",
    "LB Nagar",
    "MGBS",
    "Secunderabad East",
    "Parade Ground",
    "Nagole",
    "Hitech City",
    "Jubilee Hills",
    "Begumpet"
  ],
  airports: [
    "Rajiv Gandhi International Airport",
    "Begumpet Airport"
  ],
  schools: [
    "Hyderabad Public School",
    "Delhi Public School Hyderabad",
    "Oakridge International School",
    "Chirec International School",
    "Johnson Grammar School",
    "Meridian School",
    "Silver Oaks International School",
    "Glendale Academy",
    "Sreenidhi International School",
    "Indus International School"
  ]
};

const DistributionInfoStep: React.FC<DistributionInfoStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [newPoint, setNewPoint] = React.useState("");
  
  // State to track expanded accordion items
  const [expandedLocations, setExpandedLocations] = React.useState<string[]>([]);
  
  const handleDistributionTypeChange = (value: 'online' | 'physical') => {
    updateFormData({ distributionType: value });
    
    // Reset distribution points when switching types
    if (value === 'online') {
      updateFormData({ distributionPoints: [] });
    }
  };
  
  const handleNumberOfTotesChange = (value: string) => {
    const numTotes = parseInt(value, 10);
    if (!isNaN(numTotes) && numTotes >= 0) {
      updateFormData({ numberOfTotes: numTotes });
    }
  };
  
  const handleAddDistributionPoint = () => {
    if (newPoint.trim()) {
      updateFormData({
        distributionPoints: [...(formData.distributionPoints || []), newPoint.trim()]
      });
      setNewPoint("");
    }
  };

  const handleRemovePoint = (index: number) => {
    const updatedPoints = [...formData.distributionPoints];
    updatedPoints.splice(index, 1);
    updateFormData({ distributionPoints: updatedPoints });
  };
  
  const handleLocationSelect = (location: string, isSelected: boolean) => {
    const currentPoints = [...formData.distributionPoints];
    
    if (isSelected) {
      // Add location if not already present
      if (!currentPoints.includes(location)) {
        updateFormData({
          distributionPoints: [...currentPoints, location]
        });
      }
    } else {
      // Remove location if present
      updateFormData({
        distributionPoints: currentPoints.filter(point => point !== location)
      });
    }
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    const currentAgeGroups = formData.demographics?.ageGroups || [];
    const updatedAgeGroups = currentAgeGroups.includes(ageGroup)
      ? currentAgeGroups.filter(group => group !== ageGroup)
      : [...currentAgeGroups, ageGroup];
    
    updateFormData({
      demographics: {
        ...formData.demographics,
        ageGroups: updatedAgeGroups
      }
    });
  };
  
  // Helper function to get tote count based on location type
  const getToteCount = (location: string): number => {
    if (locationData.schools.includes(location)) return 400;
    if (locationData.malls.includes(location)) return 800;
    if (locationData.metroStations.includes(location)) return 800;
    if (locationData.airports.includes(location)) return 1000;
    return 10; // Default for custom locations
  };
  
  // Calculate total totes for all selected distribution points
  const calculateTotalTotes = (): number => {
    return formData.distributionPoints.reduce((total, point) => {
      return total + getToteCount(point);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-2">Distribution Information</h2>
        <p className="text-gray-600 mb-6">
          Help us understand how and when you plan to distribute the totes
        </p>
        
        <div className="space-y-6">
          {/* Distribution Type Selection */}
          <div className="space-y-3">
            <Label>Distribution Type</Label>
            <p className="text-sm text-muted-foreground">
              How do you plan to distribute the totes?
            </p>
            
            <RadioGroup
              value={formData.distributionType}
              onValueChange={(value) => handleDistributionTypeChange(value as 'online' | 'physical')}
              className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="cursor-pointer">Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="physical" />
                <Label htmlFor="physical" className="cursor-pointer">Physical</Label>
              </div>
            </RadioGroup>
          </div>
        
          {/* Conditional Rendering based on Distribution Type */}
          {formData.distributionType === 'online' ? (
            // Online Distribution - Show only number of totes
            <div className="space-y-3">
              <Label>Number of Totes</Label>
              <p className="text-sm text-muted-foreground">
                How many totes do you plan to distribute online?
              </p>
              <Input
                type="number"
                min={0}
                value={formData.numberOfTotes || ''}
                onChange={(e) => handleNumberOfTotesChange(e.target.value)}
                placeholder="Enter number of totes"
                className="max-w-xs"
              />
            </div>
          ) : formData.distributionType === 'physical' ? (
            // Physical Distribution - Show location accordion
            <div className="space-y-3">
              <Label>Physical Distribution Locations</Label>
              <p className="text-sm text-muted-foreground">
                Select the locations where you plan to distribute the totes
              </p>
              
              <Accordion type="multiple" className="w-full border rounded-md">
                {/* Malls Section */}
                <AccordionItem value="malls">
                  <AccordionTrigger className="px-4">
                    <div className="flex justify-between w-full">
                      <span>Malls</span>
                      <span className="text-sm text-muted-foreground">10 locations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {locationData.malls.map((mall) => (
                        <div key={mall} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mall-${mall}`}
                            checked={formData.distributionPoints.includes(mall)}
                            onCheckedChange={(checked) => handleLocationSelect(mall, !!checked)}
                          />
                          <label
                            htmlFor={`mall-${mall}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {mall}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Metro Stations Section */}
                <AccordionItem value="metro-stations">
                  <AccordionTrigger className="px-4">
                    <div className="flex justify-between w-full">
                      <span>Metro Stations</span>
                      <span className="text-sm text-muted-foreground">10 locations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {locationData.metroStations.map((station) => (
                        <div key={station} className="flex items-center space-x-2">
                          <Checkbox
                            id={`station-${station}`}
                            checked={formData.distributionPoints.includes(station)}
                            onCheckedChange={(checked) => handleLocationSelect(station, !!checked)}
                          />
                          <label
                            htmlFor={`station-${station}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {station}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Airports Section */}
                <AccordionItem value="airports">
                  <AccordionTrigger className="px-4">
                    <div className="flex justify-between w-full">
                      <span>Airports</span>
                      <span className="text-sm text-muted-foreground">2 locations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {locationData.airports.map((airport) => (
                        <div key={airport} className="flex items-center space-x-2">
                          <Checkbox
                            id={`airport-${airport}`}
                            checked={formData.distributionPoints.includes(airport)}
                            onCheckedChange={(checked) => handleLocationSelect(airport, !!checked)}
                          />
                          <label
                            htmlFor={`airport-${airport}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {airport}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Schools Section */}
                <AccordionItem value="schools">
                  <AccordionTrigger className="px-4">
                    <div className="flex justify-between w-full">
                      <span>Schools</span>
                      <span className="text-sm text-muted-foreground">10 locations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {locationData.schools.map((school) => (
                        <div key={school} className="flex items-center space-x-2">
                          <Checkbox
                            id={`school-${school}`}
                            checked={formData.distributionPoints.includes(school)}
                            onCheckedChange={(checked) => handleLocationSelect(school, !!checked)}
                          />
                          <label
                            htmlFor={`school-${school}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {school}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Custom Location Input */}
              <div className="flex items-end space-x-2 mt-4">
                <div className="flex-grow">
                  <Label htmlFor="custom-location" className="mb-2 block">Add Custom Location</Label>
                  <Input
                    id="custom-location"
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    placeholder="Enter location name"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddDistributionPoint}
                  disabled={!newPoint.trim()}
                >
                  Add
                </Button>
              </div>
              
              {/* Selected Distribution Points */}
              {formData.distributionPoints.length > 0 && (
                <div className="mt-4 border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Selected Distribution Points ({formData.distributionPoints.length})</Label>
                    <span className="text-sm text-muted-foreground">Total Totes: {calculateTotalTotes()}</span>
                  </div>
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {formData.distributionPoints.map((point, index) => (
                      <li key={index} className="flex items-center justify-between bg-background p-2 rounded-md text-sm">
                        <span>{point}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{getToteCount(point)} totes</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemovePoint(index)}
                            className="h-7 px-2"
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      
        {/* Distribution Period - For both online and physical */}
        <div className="space-y-3">
          <Label>Distribution Period</Label>
          <p className="text-sm text-muted-foreground">
            When do you plan to start and end the distribution of totes?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <Label className="mb-2 block">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left",
                      !formData.distributionStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.distributionStartDate ? (
                      format(formData.distributionStartDate, "PPP")
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.distributionStartDate}
                    onSelect={(date) => updateFormData({ distributionStartDate: date })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => 
                      formData.distributionEndDate ? date > formData.distributionEndDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* End Date */}
            <div>
              <Label className="mb-2 block">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left",
                      !formData.distributionEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.distributionEndDate ? (
                      format(formData.distributionEndDate, "PPP")
                    ) : (
                      <span>Pick an end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.distributionEndDate}
                    onSelect={(date) => updateFormData({ distributionEndDate: date })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => 
                      formData.distributionStartDate ? date < formData.distributionStartDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
          
        {/* Demographics */}
        <div className="space-y-3">
          <Label>Target Demographics</Label>
          <p className="text-sm text-muted-foreground">
            Who will be receiving these totes?
          </p>
          
          <div className="space-y-4">
            {/* Age Groups */}
            <div className="space-y-3">
              <Label className="text-sm">Age Groups (select all that apply):</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Children (0-12)", "Teens (13-19)", "Young Adults (20-35)", "Adults (36-64)", "Seniors (65+)"].map((ageGroup) => (
                  <div key={ageGroup} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`age-${ageGroup}`} 
                      checked={(formData.demographics?.ageGroups || []).includes(ageGroup)}
                      onCheckedChange={() => handleAgeGroupChange(ageGroup)}
                    />
                    <label
                      htmlFor={`age-${ageGroup}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {ageGroup}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Income Level */}
            <div className="space-y-2">
              <Label className="text-sm">Income Level:</Label>
              <Select
                value={formData.demographics?.income || ""}
                onValueChange={(value) => 
                  updateFormData({
                    demographics: { ...formData.demographics, income: value }
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select income level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Income</SelectItem>
                  <SelectItem value="middle">Middle Income</SelectItem>
                  <SelectItem value="high">High Income</SelectItem>
                  <SelectItem value="mixed">Mixed Income Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Education Level */}
            <div className="space-y-2">
              <Label className="text-sm">Education Level:</Label>
              <Select
                value={formData.demographics?.education || ""}
                onValueChange={(value) => 
                  updateFormData({
                    demographics: { ...formData.demographics, education: value }
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Education</SelectItem>
                  <SelectItem value="secondary">Secondary Education</SelectItem>
                  <SelectItem value="higher">Higher Education</SelectItem>
                  <SelectItem value="mixed">Mixed Education Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Other Demographics */}
            <div className="space-y-2">
              <Label className="text-sm">Other Demographic Information:</Label>
              <Textarea
                placeholder="Provide any other relevant demographic information"
                value={formData.demographics?.other || ""}
                onChange={(e) => 
                  updateFormData({
                    demographics: { ...formData.demographics, other: e.target.value }
                  })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionInfoStep;
