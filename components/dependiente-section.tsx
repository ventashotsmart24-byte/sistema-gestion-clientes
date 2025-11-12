
'use client';

import { useState } from 'react';
import { Dependiente, STATUS_MIGRATORIO_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, User, Calendar, Hash, DollarSign } from 'lucide-react';

interface DependienteSectionProps {
  dependientes: Dependiente[];
  onChange: (dependientes: Dependiente[]) => void;
}

export function DependienteSection({ dependientes, onChange }: DependienteSectionProps) {
  const [showCount, setShowCount] = useState(Math.max(3, dependientes.length));

  // Inicializar dependientes vacíos si no hay suficientes
  const initializeDependientes = () => {
    const deps = [...dependientes];
    while (deps.length < showCount) {
      deps.push({
        id: `dep-${Date.now()}-${deps.length}`,
        nombre: '',
        dob: '',
        edad: 0,
        statusLegal: 'RESIDENTE',
        ss: '',
        ingreso: 0,
        aplicaSeguro: false,
        tps: ''
      });
    }
    return deps.slice(0, showCount);
  };

  const currentDependientes = initializeDependientes();

  // Formatear Social Security Number
  const formatSSN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 9) {
      const formatted = cleaned.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      return formatted;
    }
    return value;
  };

  // Calcular edad desde fecha de nacimiento
  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return Math.max(0, age);
  };

  const handleDependienteChange = (index: number, field: keyof Dependiente, value: any) => {
    const updatedDependientes = [...currentDependientes];
    const dependiente = { ...updatedDependientes[index] };
    
    switch (field) {
      case 'ss':
        (dependiente as any)[field] = formatSSN(value);
        break;
      case 'dob':
        (dependiente as any)[field] = value;
        dependiente.edad = calculateAge(value);
        break;
      default:
        (dependiente as any)[field] = value;
    }
    
    updatedDependientes[index] = dependiente;
    
    // Filtrar dependientes con nombre para enviar al componente padre
    const validDependientes = updatedDependientes.filter(dep => dep.nombre?.trim());
    onChange(validDependientes);
  };

  const expandDependientes = () => {
    const newCount = Math.min(showCount + 1, 7);
    setShowCount(newCount);
  };

  const collapseDependientes = () => {
    if (showCount > 3) {
      const newCount = showCount - 1;
      setShowCount(newCount);
      
      // Si estamos reduciendo, mantener solo los dependientes válidos hasta el nuevo límite
      const validDeps = currentDependientes.slice(0, newCount).filter(dep => dep.nombre?.trim());
      onChange(validDeps);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Dependientes ({showCount} de 7 máximo)</h3>
          <p className="text-sm text-gray-600">
            Mostrando {showCount} dependiente{showCount !== 1 ? 's' : ''}. 
            Los dependientes con nombre se guardarán automáticamente.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={collapseDependientes}
            disabled={showCount <= 3}
            className="flex items-center space-x-1"
          >
            <Minus className="h-4 w-4" />
            <span>Reducir</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={expandDependientes}
            disabled={showCount >= 7}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Expandir</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {currentDependientes.map((dependiente, index) => (
          <Card key={dependiente.id || `temp-${index}`} className="relative">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <User className="h-4 w-4" />
                <span>Dependiente {index + 1}</span>
                {dependiente.nombre && (
                  <span className="text-sm font-normal text-green-600">
                    - {dependiente.nombre}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`dep-nombre-${index}`}>Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`dep-nombre-${index}`}
                    value={dependiente.nombre || ''}
                    onChange={(e) => handleDependienteChange(index, 'nombre', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dep-dob-${index}`}>Fecha de Nacimiento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`dep-dob-${index}`}
                    type="date"
                    value={dependiente.dob || ''}
                    onChange={(e) => handleDependienteChange(index, 'dob', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dep-edad-${index}`}>Edad</Label>
                <Input
                  id={`dep-edad-${index}`}
                  type="number"
                  value={dependiente.edad || 0}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dep-status-${index}`}>Status Legal</Label>
                <Select 
                  value={dependiente.statusLegal || 'RESIDENTE'} 
                  onValueChange={(value) => handleDependienteChange(index, 'statusLegal', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_MIGRATORIO_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dep-ss-${index}`}>Social Security #</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`dep-ss-${index}`}
                    value={dependiente.ss || ''}
                    onChange={(e) => handleDependienteChange(index, 'ss', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                    className="pl-10"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dep-ingreso-${index}`}>Ingreso</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`dep-ingreso-${index}`}
                    type="number"
                    step="0.01"
                    value={dependiente.ingreso || 0}
                    onChange={(e) => handleDependienteChange(index, 'ingreso', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dep-tps-${index}`}>TPS</Label>
                <Input
                  id={`dep-tps-${index}`}
                  value={dependiente.tps || ''}
                  onChange={(e) => handleDependienteChange(index, 'tps', e.target.value)}
                />
              </div>

              <div className="space-y-4 md:col-span-2 lg:col-span-1">
                <Label>Opciones</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`dep-aplica-${index}`}
                    checked={dependiente.aplicaSeguro || false}
                    onCheckedChange={(checked) => handleDependienteChange(index, 'aplicaSeguro', checked)}
                  />
                  <Label htmlFor={`dep-aplica-${index}`} className="text-sm">
                    Aplica al Seguro
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
