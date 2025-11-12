
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cliente, Dependiente, ESTADOS_USA, CIUDADES_USA, COMPAÑIAS_SEGURO, STATUS_MIGRATORIO_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { DependienteSection } from '@/components/dependiente-section';
import { 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  CreditCard, 
  Shield,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';

interface ClienteFormProps {
  cliente?: Cliente | null;
  onClose: () => void;
}

export function ClienteForm({ cliente, onClose }: ClienteFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Cliente>({
    nombre: '',
    año: new Date().getFullYear(),
    statusMigratorio: 'RESIDENTE',
    ss: '',
    alien: '',
    dob: '',
    edad: 0,
    direccion: '',
    ciudad: '',
    estado: '',
    zipCode: '',
    condado: '',
    telefono: '',
    email: '',
    numeroDep: '',
    lugarTrabajo: '',
    ocupacion: '',
    ingreso1: 0,
    ingreso2: 0,
    totalIngresos: 0,
    banco: '',
    ruta: '',
    cuenta: '',
    nombreCuenta: '',
    ultimos4Tarjeta: '',
    fechaVencimiento: '',
    cvc: '',
    nombreTarjeta: '',
    compañiaSeguro: 'Florida Blue',
    nombrePlan: '',
    idPlan: '',
    hmo: false,
    ppo: false,
    idMercado: '',
    valorPrima: 0,
    deducible: 0,
    coInsurance: '',
    maxOop: 0,
    drPrimario: '',
    especialista: '',
    urgencia: '',
    emergencia: '',
    medGenerica: '',
    lab: '',
    rxMrs: '',
    tps: '',
    parol: '',
    permisoTrabajo: '',
    notas: '',
    dependientes: []
  });

  // Cargar datos del cliente si está editando
  useEffect(() => {
    if (cliente) {
      setFormData({
        ...cliente,
        dependientes: cliente.dependientes || []
      });
    }
  }, [cliente]);

  // Calcular edad automáticamente cuando cambie la fecha de nacimiento
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, edad: age }));
    }
  }, [formData.dob]);

  // Calcular total de ingresos automáticamente
  useEffect(() => {
    const total = (formData.ingreso1 || 0) + (formData.ingreso2 || 0);
    setFormData(prev => ({ ...prev, totalIngresos: total }));
  }, [formData.ingreso1, formData.ingreso2]);

  // Formatear Social Security Number
  const formatSSN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 9) {
      const formatted = cleaned.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      return formatted;
    }
    return value;
  };

  // Formatear Alien Number
  const formatAlienNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 9) {
      const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})/, 'A-$1-$2-$3');
      return formatted;
    }
    return value;
  };

  // Formatear teléfono
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      return formatted;
    }
    return value;
  };

  // Formatear fecha de vencimiento MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      const formatted = cleaned.replace(/(\d{2})(\d{2})/, '$1/$2');
      return formatted;
    }
    return value;
  };

  const handleInputChange = (field: keyof Cliente, value: any) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      switch (field) {
        case 'ss':
          (updated as any)[field] = formatSSN(value);
          break;
        case 'alien':
          (updated as any)[field] = formatAlienNumber(value);
          break;
        case 'telefono':
          (updated as any)[field] = formatPhone(value);
          break;
        case 'fechaVencimiento':
          (updated as any)[field] = formatExpiryDate(value);
          break;
        case 'ultimos4Tarjeta':
          // Limitar a 4 dígitos
          (updated as any)[field] = value.replace(/\D/g, '').slice(0, 4);
          break;
        case 'cvc':
          // Limitar a 3-4 dígitos
          (updated as any)[field] = value.replace(/\D/g, '').slice(0, 4);
          break;
        case 'zipCode':
          // Limitar a 5 dígitos
          (updated as any)[field] = value.replace(/\D/g, '').slice(0, 5);
          break;
        default:
          (updated as any)[field] = value;
      }
      
      return updated;
    });
  };

  const handleDependientesChange = (dependientes: Dependiente[]) => {
    setFormData(prev => ({ ...prev, dependientes }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.nombre?.trim()) {
        toast.error('El nombre es requerido');
        setLoading(false);
        return;
      }

      if (!formData.email?.trim()) {
        toast.error('El email es requerido');
        setLoading(false);
        return;
      }

      const dataToSave = {
        ...formData,
        updatedAt: serverTimestamp(),
        ...(cliente ? {} : { createdAt: serverTimestamp() })
      };

      if (cliente?.id) {
        // Actualizar cliente existente
        const clienteRef = doc(db, 'clientes', cliente.id);
        await updateDoc(clienteRef, dataToSave);
        toast.success('Cliente actualizado exitosamente');
      } else {
        // Crear nuevo cliente
        await addDoc(collection(db, 'clientes'), dataToSave);
        toast.success('Cliente creado exitosamente');
      }

      onClose();
    } catch (error) {
      console.error('Error saving cliente:', error);
      toast.error('Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {cliente ? `Editando: ${cliente.nombre}` : 'Agregar nuevo cliente al sistema'}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Información Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="año">Año</Label>
                <Input
                  id="año"
                  type="number"
                  value={formData.año}
                  onChange={(e) => handleInputChange('año', parseInt(e.target.value) || new Date().getFullYear())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusMigratorio">Status Migratorio</Label>
                <Select 
                  value={formData.statusMigratorio} 
                  onValueChange={(value) => handleInputChange('statusMigratorio', value)}
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
                <Label htmlFor="ss">Social Security #</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="ss"
                    value={formData.ss}
                    onChange={(e) => handleInputChange('ss', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                    className="pl-10"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alien">Alien Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="alien"
                    value={formData.alien}
                    onChange={(e) => handleInputChange('alien', e.target.value)}
                    placeholder="A-XXX-XXX-XXX"
                    className="pl-10"
                    maxLength={13}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Fecha de Nacimiento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="(XXX) XXX-XXXX"
                    className="pl-10"
                    maxLength={14}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Dirección</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <SearchableSelect
                  value={formData.ciudad}
                  onValueChange={(value) => handleInputChange('ciudad', value)}
                  options={CIUDADES_USA}
                  placeholder="Buscar ciudad..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <SearchableSelect
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange('estado', value)}
                  options={ESTADOS_USA}
                  placeholder="Buscar estado..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condado">Condado</Label>
                <Input
                  id="condado"
                  value={formData.condado}
                  onChange={(e) => handleInputChange('condado', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Laboral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Información Laboral</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numeroDep">Número Dependientes</Label>
                <Input
                  id="numeroDep"
                  value={formData.numeroDep}
                  onChange={(e) => handleInputChange('numeroDep', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lugarTrabajo">Lugar de Trabajo</Label>
                <Input
                  id="lugarTrabajo"
                  value={formData.lugarTrabajo}
                  onChange={(e) => handleInputChange('lugarTrabajo', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocupacion">Ocupación</Label>
                <Input
                  id="ocupacion"
                  value={formData.ocupacion}
                  onChange={(e) => handleInputChange('ocupacion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingreso1">Ingreso 1</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="ingreso1"
                    type="number"
                    step="0.01"
                    value={formData.ingreso1}
                    onChange={(e) => handleInputChange('ingreso1', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingreso2">Ingreso 2</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="ingreso2"
                    type="number"
                    step="0.01"
                    value={formData.ingreso2}
                    onChange={(e) => handleInputChange('ingreso2', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalIngresos">Total Ingresos</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="totalIngresos"
                    type="number"
                    step="0.01"
                    value={formData.totalIngresos}
                    readOnly
                    className="bg-gray-50 pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Bancaria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Información Bancaria y de Pago</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Input
                  id="banco"
                  value={formData.banco}
                  onChange={(e) => handleInputChange('banco', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruta"># Ruta</Label>
                <Input
                  id="ruta"
                  value={formData.ruta}
                  onChange={(e) => handleInputChange('ruta', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuenta"># Cuenta</Label>
                <Input
                  id="cuenta"
                  value={formData.cuenta}
                  onChange={(e) => handleInputChange('cuenta', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombreCuenta">Nombre en la Cuenta</Label>
                <Input
                  id="nombreCuenta"
                  value={formData.nombreCuenta}
                  onChange={(e) => handleInputChange('nombreCuenta', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ultimos4Tarjeta">Últimos 4 Núm. Tarjeta</Label>
                <Input
                  id="ultimos4Tarjeta"
                  value={formData.ultimos4Tarjeta}
                  onChange={(e) => handleInputChange('ultimos4Tarjeta', e.target.value)}
                  maxLength={4}
                  placeholder="XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaVencimiento">Fecha Vencimiento</Label>
                <Input
                  id="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  maxLength={4}
                  placeholder="XXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombreTarjeta">Nombre Tarjeta</Label>
                <Input
                  id="nombreTarjeta"
                  value={formData.nombreTarjeta}
                  onChange={(e) => handleInputChange('nombreTarjeta', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de Seguro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Información de Seguro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="compañiaSeguro">Compañía de Seguros</Label>
                  <Select 
                    value={formData.compañiaSeguro} 
                    onValueChange={(value) => handleInputChange('compañiaSeguro', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPAÑIAS_SEGURO.map(compañia => (
                        <SelectItem key={compañia} value={compañia}>
                          {compañia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombrePlan">Nombre del Plan</Label>
                  <Input
                    id="nombrePlan"
                    value={formData.nombrePlan}
                    onChange={(e) => handleInputChange('nombrePlan', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idPlan">ID del Plan</Label>
                  <Input
                    id="idPlan"
                    value={formData.idPlan}
                    onChange={(e) => handleInputChange('idPlan', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Tipo de Plan</Label>
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hmo"
                        checked={formData.hmo}
                        onCheckedChange={(checked) => handleInputChange('hmo', checked)}
                      />
                      <Label htmlFor="hmo">HMO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ppo"
                        checked={formData.ppo}
                        onCheckedChange={(checked) => handleInputChange('ppo', checked)}
                      />
                      <Label htmlFor="ppo">PPO</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idMercado">ID Mercado</Label>
                  <Input
                    id="idMercado"
                    value={formData.idMercado}
                    onChange={(e) => handleInputChange('idMercado', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorPrima">Valor Prima</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="valorPrima"
                      type="number"
                      step="0.01"
                      value={formData.valorPrima}
                      onChange={(e) => handleInputChange('valorPrima', parseFloat(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deducible">Deducible</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="deducible"
                      type="number"
                      step="0.01"
                      value={formData.deducible}
                      onChange={(e) => handleInputChange('deducible', parseFloat(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coInsurance">Co. Insurance</Label>
                  <Input
                    id="coInsurance"
                    value={formData.coInsurance}
                    onChange={(e) => handleInputChange('coInsurance', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOop">Max OOP</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="maxOop"
                      type="number"
                      step="0.01"
                      value={formData.maxOop}
                      onChange={(e) => handleInputChange('maxOop', parseFloat(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Servicios Médicos */}
              <div>
                <h3 className="text-lg font-medium mb-4">Servicios Médicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="drPrimario">Dr. Primario</Label>
                    <Input
                      id="drPrimario"
                      value={formData.drPrimario}
                      onChange={(e) => handleInputChange('drPrimario', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="especialista">Especialista</Label>
                    <Input
                      id="especialista"
                      value={formData.especialista}
                      onChange={(e) => handleInputChange('especialista', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencia">Urgencia</Label>
                    <Input
                      id="urgencia"
                      value={formData.urgencia}
                      onChange={(e) => handleInputChange('urgencia', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencia">Emergencia</Label>
                    <Input
                      id="emergencia"
                      value={formData.emergencia}
                      onChange={(e) => handleInputChange('emergencia', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medGenerica">Med. Genérica</Label>
                    <Input
                      id="medGenerica"
                      value={formData.medGenerica}
                      onChange={(e) => handleInputChange('medGenerica', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lab">LAB</Label>
                    <Input
                      id="lab"
                      value={formData.lab}
                      onChange={(e) => handleInputChange('lab', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rxMrs">RX-MRS</Label>
                    <Input
                      id="rxMrs"
                      value={formData.rxMrs}
                      onChange={(e) => handleInputChange('rxMrs', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Status Específicos */}
              <div>
                <h3 className="text-lg font-medium mb-4">Status Específicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tps">TPS</Label>
                    <Input
                      id="tps"
                      value={formData.tps}
                      onChange={(e) => handleInputChange('tps', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parol">PAROL</Label>
                    <Input
                      id="parol"
                      value={formData.parol}
                      onChange={(e) => handleInputChange('parol', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permisoTrabajo">Permiso de Trabajo</Label>
                    <Input
                      id="permisoTrabajo"
                      value={formData.permisoTrabajo}
                      onChange={(e) => handleInputChange('permisoTrabajo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dependientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Dependientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DependienteSection
                dependientes={formData.dependientes}
                onChange={handleDependientesChange}
              />
            </CardContent>
          </Card>

          {/* Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Notas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notas">Notas del Cliente</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => handleInputChange('notas', e.target.value)}
                  rows={4}
                  placeholder="Agregar notas adicionales sobre el cliente..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={16} />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{cliente ? 'Actualizar Cliente' : 'Crear Cliente'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
