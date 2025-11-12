
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ClienteForm } from '@/components/cliente-form';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { 
  Search, 
  Plus, 
  Users, 
  LogOut, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  MapPin,
  Shield,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, cliente: Cliente | null}>({
    show: false,
    cliente: null
  });

  // Cargar clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      const clientesRef = collection(db, 'clientes');
      const q = query(clientesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const clientesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      
      setClientes(clientesData);
      setFilteredClientes(clientesData);
    } catch (error) {
      console.error('Error loading clientes:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  // Filtrar clientes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClientes(clientes);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = clientes.filter(cliente =>
      cliente.nombre?.toLowerCase().includes(term) ||
      cliente.email?.toLowerCase().includes(term) ||
      cliente.ss?.includes(term) ||
      cliente.telefono?.includes(term) ||
      cliente.ciudad?.toLowerCase().includes(term) ||
      cliente.estado?.toLowerCase().includes(term) ||
      cliente.compañiaSeguro?.toLowerCase().includes(term)
    );
    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  const handleDeleteCliente = async (clienteId: string, userPassword: string) => {
    try {
      // Aquí normalmente verificarías la contraseña del usuario
      // Para este ejemplo, simplemente procederemos con la eliminación
      await deleteDoc(doc(db, 'clientes', clienteId));
      toast.success('Cliente eliminado exitosamente');
      setDeleteConfirm({ show: false, cliente: null });
      loadClientes();
    } catch (error) {
      console.error('Error deleting cliente:', error);
      toast.error('Error al eliminar el cliente');
    }
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCliente(null);
    loadClientes();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (showForm) {
    return (
      <ClienteForm
        cliente={editingCliente}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestión de Clientes</h1>
                  <p className="text-sm text-gray-600">Sistema de Seguros</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Filtrados</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredClientes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientes.length > 0 ? formatCurrency(
                  clientes.reduce((sum, cliente) => sum + (cliente.totalIngresos || 0), 0) / clientes.length
                ) : '$0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compañías Activas</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(clientes.map(c => c.compañiaSeguro)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email, SS#, teléfono, ciudad, estado o compañía..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Cliente</span>
          </Button>
        </div>

        {/* Clientes List */}
        {filteredClientes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza agregando tu primer cliente al sistema'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {cliente.nombre}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>{cliente.edad} años</span>
                            <span className="text-gray-400">•</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {cliente.statusMigratorio}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {cliente.compañiaSeguro}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{cliente.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{formatPhone(cliente.telefono)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{cliente.ciudad}, {cliente.estado}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>Ingresos: {formatCurrency(cliente.totalIngresos || 0)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span>Prima: {formatCurrency(cliente.valorPrima || 0)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{cliente.dependientes?.length || 0} dependientes</span>
                        </div>
                      </div>

                      {cliente.notas && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 line-clamp-2">{cliente.notas}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCliente(cliente)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm({ show: true, cliente })}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && deleteConfirm.cliente && (
        <DeleteConfirmDialog
          cliente={deleteConfirm.cliente}
          onConfirm={handleDeleteCliente}
          onCancel={() => setDeleteConfirm({ show: false, cliente: null })}
        />
      )}
    </div>
  );
}
