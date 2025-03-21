#SingleInstance Force
SendMode Input
SetKeyDelay, 50, 50
CoordMode, Mouse, Screen  ; 使用屏幕坐标

; 创建 GUI 界面
Gui, +AlwaysOnTop +ToolWindow
Gui, Add, Button, x10 y10 w200 h50 gStartProcess, 启动自动发送流程
Gui, Add, Button, x10 y70 w200 h50 gExitScript, 退出脚本
Gui, Show, w220 h130, PDF到Coze发送工具
return

; 启动自动发送流程
StartProcess:
    ; 1. 点击右下角的Coze聊天图标
    Click, 2466, 1429  ; 调整坐标以匹配右下角Coze图标
    Sleep, 500  ; 等待图标响应

    ; 2. 聚焦到聊天输入框 (根据您的屏幕调整坐标)
    Click, 2096, 1355  ; 调整坐标以匹配聊天输入框位置
    Sleep, 500  ; 等待输入框响应

    ; 3. 粘贴文本
    Send, ^v  ; 将剪贴板中的内容粘贴到输入框
    Sleep, 200  ; 等待粘贴完成

    ; 4. 点击发送按钮或按回车
    Send, {Enter}  ; 确保按下回车键

    ; 5. 提示操作完成（无弹窗，使用 ToolTip 提示）
    ToolTip, 文本已成功发送到Coze!, % A_ScreenWidth/2, % A_ScreenHeight/2
    Sleep, 1000  ; 提示显示 1 秒
    ToolTip  ; 移除提示
return

; 退出脚本
ExitScript:
    ExitApp
return

; GUI 关闭事件
GuiClose:
    ExitApp
return