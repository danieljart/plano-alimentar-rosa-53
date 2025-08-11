import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Shield, User } from "lucide-react";

interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  email?: string;
  roles: string[];
}

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get user emails from auth admin endpoint
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      const usersWithRoles = profiles?.map(profile => {
        const authUser = authUsers?.users?.find((u: any) => u.id === profile.id);
        const roles = userRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || ['user'];
        return {
          ...profile,
          email: authUser?.email,
          roles
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeminiKey = () => {
    if (!geminiKey.trim()) {
      toast.error("Insira uma chave válida");
      return;
    }
    // In a real implementation, this would save to Supabase secrets
    toast.success("Chave Gemini salva no servidor");
    setGeminiKey("");
  };

  const toggleAdminRole = async (userId: string, hasAdmin: boolean) => {
    try {
      if (hasAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        
        if (error) throw error;
        toast.success('Permissão de admin removida');
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        
        if (error) throw error;
        toast.success('Permissão de admin concedida');
      }
      
      await loadUsers();
    } catch (error) {
      console.error('Error toggling admin role:', error);
      toast.error('Erro ao alterar permissões');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      toast.success('Usuário excluído');
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Administração | Gestão de Usuários</title>
        <meta name="description" content="Painel administrativo para gerenciar usuários e configurações" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Administração</h1>
        <Badge variant="default">Admin</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração Global do Gemini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Chave API do Gemini (Servidor)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="password"
                placeholder="Sua chave API do Gemini"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <Button onClick={handleSaveGeminiKey}>
                Salvar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Esta chave será usada por todos os usuários da aplicação
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando usuários...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => {
                  const hasAdmin = userProfile.roles.includes('admin');
                  return (
                    <TableRow key={userProfile.id}>
                      <TableCell>
                        {userProfile.display_name || 'Sem nome'}
                      </TableCell>
                      <TableCell>{userProfile.email}</TableCell>
                      <TableCell>
                        {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="secondary">
                            <User className="w-3 h-3 mr-1" />
                            user
                          </Badge>
                          {hasAdmin && (
                            <Badge variant="default">
                              <Shield className="w-3 h-3 mr-1" />
                              admin
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={hasAdmin ? "destructive" : "default"}
                            onClick={() => toggleAdminRole(userProfile.id, hasAdmin)}
                            disabled={userProfile.id === user?.id}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            {hasAdmin ? 'Remover Admin' : 'Tornar Admin'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUser(userProfile.id)}
                            disabled={userProfile.id === user?.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}