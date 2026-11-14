[Setup]
AppId={{ED0F6BCB-261E-4CEC-A3E3-C193BC4F13F2}
AppName=LearnLock
AppVersion=1.0.1
AppPublisher=LearnLock
AppPublisherURL=https://learnlock.com
AppSupportURL=https://learnlock.com
AppUpdatesURL=https://learnlock.com
DefaultDirName={commonpf64}\LearnLock
DisableProgramGroupPage=yes
OutputDir=e:\antigravity\begrenzung\learnlock-web\public\download
OutputBaseFilename=LearnLock-Setup
SetupIconFile=e:\antigravity\begrenzung\LearnLock.App\Assets\AppIcon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
CloseApplications=yes

[Languages]
Name: "german"; MessagesFile: "compiler:Languages\German.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "e:\antigravity\begrenzung\LearnLock.App\bin\Release\net9.0-windows10.0.26100.0\win-x64\publish\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Dirs]
Name: "{commonappdata}\LearnLock"; Permissions: users-full

[Icons]
Name: "{commonprograms}\LearnLock"; Filename: "{app}\LearnLock.App.exe"; IconFilename: "{app}\Assets\AppIcon.ico"
Name: "{commondesktop}\LearnLock"; Filename: "{app}\LearnLock.App.exe"; IconFilename: "{app}\Assets\AppIcon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\LearnLock.App.exe"; Description: "{cm:LaunchProgram,LearnLock}"; Flags: nowait postinstall skipifsilent

[Code]
var
  UsersPage: TInputOptionWizardPage;
  UserList: TStringList;
  UserSidList: TStringList;

procedure DiscoverWindowsUsers();
var
  SubKeys: TArrayOfString;
  I: Integer;
  ProfilePath: String;
  UserNameStr: String;
  RegKey: String;
begin
  UserList := TStringList.Create;
  UserSidList := TStringList.Create;

  RegKey := 'SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList';
  if RegGetSubkeyNames(HKLM, RegKey, SubKeys) then
  begin
    for I := 0 to GetArrayLength(SubKeys) - 1 do
    begin
      // Filter standard user accounts starting with S-1-5-21-
      if Pos('S-1-5-21-', SubKeys[I]) = 1 then
      begin
        if RegQueryStringValue(HKLM, RegKey + '\' + SubKeys[I], 'ProfileImagePath', ProfilePath) then
        begin
          UserNameStr := ExtractFileName(ProfilePath);
          if (UserNameStr <> '') and (CompareText(UserNameStr, 'Public') <> 0) and (CompareText(UserNameStr, 'Default') <> 0) then
          begin
            UserList.Add(UserNameStr);
            UserSidList.Add(SubKeys[I]);
          end;
        end;
      end;
    end;
  end;
end;

procedure InitializeWizard();
var
  I: Integer;
begin
  DiscoverWindowsUsers();

  UsersPage := CreateInputOptionPage(
    wpSelectTasks,
    'Benutzerkonten auswählen',
    'Für welche Windows-Benutzer soll LearnLock aktiv sein?',
    'Wählen Sie die Benutzerkonten Ihrer Kinder aus. LearnLock startet auf den ausgewählten Konten automatisch bei der Anmeldung und schützt den PC.',
    False,
    True
  );

  for I := 0 to UserList.Count - 1 do
  begin
    UsersPage.Add(UserList[I]);
    // By default, check all accounts that are not 'Administrator' or current setup user
    if (CompareText(UserList[I], 'Administrator') <> 0) and (CompareText(UserList[I], ExpandConstant('{username}')) <> 0) then
      UsersPage.Values[I] := True
    else
      UsersPage.Values[I] := False;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  I: Integer;
  ProtectedUsers: String;
  SelectedCount: Integer;
  CmdLine: String;
  ResultCode: Integer;
  AppExe: String;
begin
  if CurStep = ssPostInstall then
  begin
    ProtectedUsers := '';
    SelectedCount := 0;
    AppExe := ExpandConstant('{app}\LearnLock.App.exe');

    for I := 0 to UserList.Count - 1 do
    begin
      if UsersPage.Values[I] then
      begin
        if ProtectedUsers <> '' then
          ProtectedUsers := ProtectedUsers + ';';
        ProtectedUsers := ProtectedUsers + UserList[I];
        SelectedCount := SelectedCount + 1;

        // Register Windows Scheduled Task at Logon for this specific Windows user
        CmdLine := Format('/Create /TN "LearnLock_%s" /TR "\"%s\"" /SC ONLOGON /RU "%s" /RL HIGHEST /F', [UserList[I], AppExe, UserList[I]]);
        Exec('schtasks.exe', CmdLine, '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
      end
      else
      begin
        // Remove task if unchecked
        CmdLine := Format('/Delete /TN "LearnLock_%s" /F', [UserList[I]]);
        Exec('schtasks.exe', CmdLine, '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
      end;
    end;

    // Save protected users into registry so LearnLock can enforce lock checks
    RegWriteStringValue(HKLM, 'SOFTWARE\LearnLock', 'ProtectedUsers', ProtectedUsers);
  end;
end;
