import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from 'lucide-react';

export const SchoolYearSelector: React.FC = () => {
    const { schoolYears, currentSchoolYearId, setSchoolYear, isLoadingSY } = useAppContext();

    if (isLoadingSY && schoolYears.length === 0) {
        return <div className="h-9 w-32 bg-gray-100 animate-pulse rounded-md" />;
    }

    if (schoolYears.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <Select
                value={currentSchoolYearId || undefined}
                onValueChange={setSchoolYear}
            >
                <SelectTrigger className="w-[140px] h-9 bg-white/50 backdrop-blur-sm border-blue-100 focus:ring-blue-500">
                    <SelectValue placeholder="Select SY" />
                </SelectTrigger>
                <SelectContent>
                    {schoolYears.map((sy) => (
                        <SelectItem key={sy.id} value={sy.id}>
                            {sy.year_name} {sy.is_active ? '(Active)' : ''}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
