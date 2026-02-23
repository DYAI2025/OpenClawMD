import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { ClayThemeToggle } from '@/components/clay';
import {
  Download,
  Paintbrush,
  FileText,
  BookOpen,
  GraduationCap,
  Globe,
  ExternalLink,
  Scale,
  Shield,
  ScrollText,
} from 'lucide-react';
import logoImg from '../../icons/logo1.png';
import type { AppView } from '../App';

interface AppSidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onStartFresh: () => void;
}

const EXTERNA_LINKS = [
  { label: 'OpenClaw.ai', url: 'https://openclaw.ai', icon: Globe },
  { label: 'ClawHub.ai', url: 'https://clawhub.ai', icon: Shield },
  { label: 'Nanoclaw', url: 'https://github.com/qwibitai/nanoclaw', icon: ExternalLink },
  { label: 'Automaton', url: 'https://github.com/Conway-Research/automaton', icon: ExternalLink },
  { label: 'OpenClaw Foundry', url: 'https://github.com/lekt9/openclaw-foundry', icon: ExternalLink },
];

export function AppSidebar({ currentView, onNavigate, onStartFresh }: AppSidebarProps) {
  const { setOpenMobile, isMobile } = useSidebar();

  const navigate = (view: AppView) => {
    onNavigate(view);
    if (isMobile) setOpenMobile(false);
  };

  const handleStartFresh = () => {
    onStartFresh();
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full shadow-clay flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="text-base font-bold text-sidebar-foreground">Animae Agentis</span>
        </button>
        <div className="flex justify-end mt-1">
          <ClayThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* ANIMAE AGENTIS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest">
            Animae Agentis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'presets'}
                  onClick={() => navigate('presets')}
                  tooltip="Presets"
                >
                  <Download className="w-4 h-4" />
                  <span>Presets</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'interview'}
                  onClick={handleStartFresh}
                  tooltip="Customizer"
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>Customizer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'how-it-works'}
                  onClick={() => navigate('how-it-works')}
                  tooltip="Templates"
                >
                  <FileText className="w-4 h-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* INTERNA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest">
            Interna
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'animae-verba'}
                  onClick={() => navigate('animae-verba')}
                  tooltip="Animae Verba"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Animae Verba</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'usus'}
                  onClick={() => navigate('usus')}
                  tooltip="Usus"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Usus</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* EXTERNA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest">
            Externa
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {EXTERNA_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.label}>
                    <SidebarMenuButton asChild tooltip={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* LEGAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest">
            Legal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'legal-impressum'}
                  onClick={() => navigate('legal-impressum')}
                  tooltip="Impressum"
                >
                  <Scale className="w-4 h-4" />
                  <span>Impressum</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'legal-privacy'}
                  onClick={() => navigate('legal-privacy')}
                  tooltip="Privacy Policy"
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'legal-tos'}
                  onClick={() => navigate('legal-tos')}
                  tooltip="Terms & Conditions"
                >
                  <ScrollText className="w-4 h-4" />
                  <span>Terms & Conditions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <p className="text-[10px] text-sidebar-foreground/30 italic text-center">
          &copy; 2026 Animae Agentis
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
