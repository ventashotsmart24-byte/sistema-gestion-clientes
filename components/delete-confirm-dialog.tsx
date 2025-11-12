
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteConfirmDialogProps {
  cliente: Cliente;
  onConfirm: (clienteId: string, password: string) => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ cliente, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password.trim()) {
      toast.error('Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    
    try {
      // Verificar la contraseña del usuario actual
      const user = auth.currentUser;
      if (!user?.email) {
        toast.error('No se pudo verificar el usuario');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, user.email, password);
      
      // Si la autenticación es exitosa, proceder con la eliminación
      onConfirm(cliente.id!, password);
    } catch (error: any) {
      console.error('Password verification error:', error);
      let errorMessage = 'Contraseña incorrecta';
      
      switch (error?.code) {
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        default:
          errorMessage = 'Error de verificación';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirmar Eliminación</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800 mb-2">
              <strong>¡Advertencia!</strong> Esta acción no se puede deshacer.
            </p>
            <p className="text-sm text-red-700">
              Estás a punto de eliminar permanentemente el cliente:
            </p>
            <p className="font-medium text-red-900 mt-1">
              {cliente.nombre} ({cliente.email})
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Confirma tu contraseña para proceder
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirm();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading || !password.trim()}
            >
              {loading ? 'Verificando...' : 'Eliminar Cliente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
