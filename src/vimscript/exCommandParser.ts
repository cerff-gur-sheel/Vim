// eslint-disable-next-line id-denylist
import { all, alt, optWhitespace, Parser, regexp, seq, string, succeed } from 'parsimmon';
import { AsciiCommand } from '../cmd_line/commands/ascii';
import { BangCommand } from '../cmd_line/commands/bang';
import { Breakpoints } from '../cmd_line/commands/breakpoints';
import { BufferDeleteCommand } from '../cmd_line/commands/bufferDelete';
import { CloseCommand } from '../cmd_line/commands/close';
import { CopyCommand } from '../cmd_line/commands/copy';
import { DeleteCommand } from '../cmd_line/commands/delete';
import { DigraphsCommand } from '../cmd_line/commands/digraph';
import { FileCommand } from '../cmd_line/commands/file';
import { FileInfoCommand } from '../cmd_line/commands/fileInfo';
import { EchoCommand } from '../cmd_line/commands/echo';
import { GotoCommand } from '../cmd_line/commands/goto';
import { GotoLineCommand } from '../cmd_line/commands/gotoLine';
import { GrepCommand } from '../cmd_line/commands/grep';
import { HistoryCommand } from '../cmd_line/commands/history';
import { ClearJumpsCommand, JumpsCommand } from '../cmd_line/commands/jumps';
import { CenterCommand, LeftCommand, RightCommand } from '../cmd_line/commands/leftRightCenter';
import { DeleteMarksCommand, MarksCommand, MarkCommand } from '../cmd_line/commands/marks';
import { ExploreCommand } from '../cmd_line/commands/explore';
import { MoveCommand } from '../cmd_line/commands/move';
import { NohlCommand } from '../cmd_line/commands/nohl';
import { NormalCommand } from '../cmd_line/commands/normal';
import { OnlyCommand } from '../cmd_line/commands/only';
import { PrintCommand } from '../cmd_line/commands/print';
import { PutExCommand } from '../cmd_line/commands/put';
import { QuitCommand } from '../cmd_line/commands/quit';
import { ReadCommand } from '../cmd_line/commands/read';
import { RedoCommand } from '../cmd_line/commands/redo';
import { RegisterCommand } from '../cmd_line/commands/register';
import { RetabCommand } from '../cmd_line/commands/retab';
import { SetCommand } from '../cmd_line/commands/set';
import { ShCommand } from '../cmd_line/commands/sh';
import { ShiftCommand } from '../cmd_line/commands/shift';
import { SmileCommand } from '../cmd_line/commands/smile';
import { SortCommand } from '../cmd_line/commands/sort';
import { SubstituteCommand } from '../cmd_line/commands/substitute';
import { TabCommand } from '../cmd_line/commands/tab';
import { TerminalCommand } from '../cmd_line/commands/terminal';
import { UndoCommand } from '../cmd_line/commands/undo';
import { VsCodeCommand } from '../cmd_line/commands/vscode';
import { WallCommand } from '../cmd_line/commands/wall';
import { WriteCommand } from '../cmd_line/commands/write';
import { WriteQuitCommand } from '../cmd_line/commands/writequit';
import { WriteQuitAllCommand } from '../cmd_line/commands/writequitall';
import { YankCommand } from '../cmd_line/commands/yank';
import { ErrorCode, VimError } from '../error';
import { VimState } from '../state/vimState';
import { StatusBar } from '../statusBar';
import { ExCommand } from './exCommand';
import { LineRange } from './lineRange';
import { nameAbbrevParser } from './parserUtils';
import { LetCommand, UnletCommand } from '../cmd_line/commands/let';
import { CallCommand, EvalCommand } from '../cmd_line/commands/eval';
import { PwdCommand } from '../cmd_line/commands/pwd';
import { HelpCommand } from '../cmd_line/commands/help';

type ArgParser = Parser<ExCommand>;

/**
 * A list of all builtin ex commands and their argument parsers
 * Each element is [[abbrev, rest], argParser]
 * If argParser is undefined, it's yet to be implemented (PRs are welcome!)
 *
 * This list comes directly from nvim's `:help index` (except a few additions, which are commented)
 */
export const builtinExCommands: ReadonlyArray<[[string, string], ArgParser | undefined]> = [
  [['', ''], succeed(new GotoLineCommand())],
  [['!', ''], BangCommand.argParser],
  [['#', ''], PrintCommand.argParser({ printNumbers: true, printText: true })],
  [['#!', ''], all.map((_) => new NoOpCommand())],
  [['&', ''], undefined],
  [['*', ''], undefined],
  [['<', ''], ShiftCommand.argParser('<')],
  [['=', ''], PrintCommand.argParser({ printNumbers: true, printText: false })],
  [['>', ''], ShiftCommand.argParser('>')],
  [['@', ''], undefined],
  [['@@', ''], undefined],
  [['N', 'ext'], undefined],
  [['a', 'ppend'], undefined],
  [['ab', 'breviate'], undefined],
  [['abc', 'lear'], undefined],
  [['abo', 'veleft'], undefined],
  [['al', 'l'], undefined],
  [['am', 'enu'], undefined],
  [['an', 'oremenu'], undefined],
  [['ar', 'gs'], undefined],
  [['arga', 'dd'], undefined],
  [['argd', 'elete'], undefined],
  [['argdo', ''], undefined],
  [['arge', 'dit'], undefined],
  [['argg', 'lobal'], undefined],
  [['argl', 'ocal'], undefined],
  [['argu', 'ment'], undefined],
  [['as', 'cii'], succeed(new AsciiCommand())],
  [['au', 'tocmd'], undefined],
  [['aug', 'roup'], undefined],
  [['aun', 'menu'], undefined],
  [['b', 'uffer'], TabCommand.argParsers.buffer],
  [['bN', 'ext'], TabCommand.argParsers.bprev],
  [['ba', 'll'], undefined],
  [['bad', 'd'], undefined],
  [['balt', ''], undefined],
  [['bd', 'elete'], BufferDeleteCommand.argParser],
  [['be', 'have'], undefined],
  [['bel', 'owright'], undefined],
  [['bf', 'irst'], TabCommand.argParsers.bfirst],
  [['bl', 'ast'], TabCommand.argParsers.blast],
  [['bm', 'odified'], undefined],
  [['bn', 'ext'], TabCommand.argParsers.bnext],
  [['bo', 'tright'], undefined],
  [['bp', 'revious'], TabCommand.argParsers.bprev],
  [['br', 'ewind'], TabCommand.argParsers.bfirst],
  [['brea', 'k'], undefined],
  [['breaka', 'dd'], Breakpoints.argParsers.add],
  [['breakd', 'el'], Breakpoints.argParsers.del],
  [['breakl', 'ist'], Breakpoints.argParsers.list],
  [['bro', 'wse'], undefined],
  [['bufdo', ''], undefined],
  [['buffers', ''], undefined],
  [['bun', 'load'], undefined],
  [['bw', 'ipeout'], undefined],
  [['c', 'hange'], undefined],
  [['cN', 'ext'], undefined],
  [['cNf', 'ile'], undefined],
  [['ca', 'bbrev'], undefined],
  [['cabc', 'lear'], undefined],
  [['cabo', 've'], undefined],
  [['cad', 'dbuffer'], undefined],
  [['cadde', 'xpr'], undefined],
  [['caddf', 'ile'], undefined],
  [['caf', 'ter'], undefined],
  [['cal', 'l'], CallCommand.argParser],
  [['cat', 'ch'], undefined],
  [['cb', 'uffer'], undefined],
  [['cbef', 'ore'], undefined],
  [['cbel', 'ow'], undefined],
  [['cbo', 'ttom'], undefined],
  [['cc', ''], undefined],
  [['ccl', 'ose'], succeed(new VsCodeCommand('workbench.action.closePanel'))],
  [['cd', ''], undefined],
  [['cdo', ''], undefined],
  [['ce', 'nter'], CenterCommand.argParser],
  [['cex', 'pr'], undefined],
  [['cf', 'ile'], undefined],
  [['cfd', 'o'], undefined],
  [['cfir', 'st'], undefined],
  [['cg', 'etfile'], undefined],
  [['cgetb', 'uffer'], undefined],
  [['cgete', 'xpr'], undefined],
  [['changes', ''], undefined],
  [['chd', 'ir'], undefined],
  [['che', 'ckpath'], undefined],
  [['checkh', 'ealth'], undefined],
  [['checkt', 'ime'], undefined],
  [['chi', 'story'], undefined],
  [['cl', 'ist'], undefined],
  [['cla', 'st'], undefined],
  [['cle', 'arjumps'], succeed(new ClearJumpsCommand())],
  [['clo', 'se'], CloseCommand.argParser],
  [['cm', 'ap'], undefined],
  [['cmapc', 'lear'], undefined],
  [['cme', 'nu'], undefined],
  [['cn', 'ext'], succeed(new VsCodeCommand('editor.action.marker.nextInFiles'))],
  [['cnew', 'er'], undefined],
  [['cnf', 'ile'], succeed(new VsCodeCommand('editor.action.marker.nextInFiles'))],
  [['cno', 'remap'], undefined],
  [['cnorea', 'bbrev'], undefined],
  [['cnoreme', 'nu'], undefined],
  [['co', 'py'], CopyCommand.argParser],
  [['col', 'der'], undefined],
  [['colo', 'rscheme'], undefined],
  [['com', 'mand'], undefined],
  [['comc', 'lear'], undefined],
  [['comp', 'iler'], undefined],
  [['con', 'tinue'], undefined],
  [['conf', 'irm'], undefined],
  [['cons', 't'], LetCommand.argParser(true)],
  [['cope', 'n'], succeed(new VsCodeCommand('workbench.panel.markers.view.focus'))],
  [['cp', 'revious'], succeed(new VsCodeCommand('editor.action.marker.prevInFiles'))],
  [['cpf', 'ile'], succeed(new VsCodeCommand('editor.action.marker.prevInFiles'))],
  [['cq', 'uit'], undefined],
  [['cr', 'ewind'], undefined],
  [['cs', 'cope'], undefined],
  [['cst', 'ag'], undefined],
  [['cu', 'nmap'], undefined],
  [['cuna', 'bbrev'], undefined],
  [['cunme', 'nu'], undefined],
  [['cw', 'indow'], succeed(new VsCodeCommand('workbench.panel.markers.view.focus'))],
  [['d', 'elete'], DeleteCommand.argParser],
  [['deb', 'ug'], undefined],
  [['debugg', 'reedy'], undefined],
  [['delc', 'ommand'], undefined],
  [['delf', 'unction'], undefined],
  [['delm', 'arks'], DeleteMarksCommand.argParser],
  [['di', 'splay'], RegisterCommand.argParser],
  [['dif', 'fupdate'], undefined],
  [['diffg', 'et'], undefined],
  [['diffo', 'ff'], undefined],
  [['diffp', 'atch'], undefined],
  [['diffpu', 't'], undefined],
  [['diffs', 'plit'], undefined],
  [['diffthis', ''], undefined],
  [['dig', 'raphs'], DigraphsCommand.argParser],
  [['dj', 'ump'], undefined],
  [['dl', ''], undefined],
  [['dli', 'st'], undefined],
  [['do', 'autocmd'], undefined],
  [['doautoa', 'll'], undefined],
  [['dr', 'op'], undefined],
  [['ds', 'earch'], undefined],
  [['dsp', 'lit'], undefined],
  [['e', 'dit'], FileCommand.argParsers.edit],
  [['ea', 'rlier'], undefined],
  [['ec', 'ho'], EchoCommand.argParser({ sep: ' ', error: false })],
  [['echoe', 'rr'], EchoCommand.argParser({ sep: ' ', error: true })],
  [['echoh', 'l'], undefined],
  [['echom', 'sg'], undefined],
  [['echon', ''], EchoCommand.argParser({ sep: '', error: false })],
  [['el', 'se'], undefined],
  [['elsei', 'f'], undefined],
  [['em', 'enu'], undefined],
  [['en', 'dif'], undefined],
  [['endf', 'unction'], undefined],
  [['endfo', 'r'], undefined],
  [['endt', 'ry'], undefined],
  [['endw', 'hile'], undefined],
  [['ene', 'w'], FileCommand.argParsers.enew],
  [['ev', 'al'], EvalCommand.argParser],
  [['ex', ''], FileCommand.argParsers.edit],
  [['exe', 'cute'], undefined],
  [['exi', 't'], WriteQuitCommand.argParser],
  [['Ex', 'plore'], succeed(new ExploreCommand())],
  [['exu', 'sage'], undefined],
  [['f', 'ile'], FileInfoCommand.argParser],
  [['files', ''], undefined],
  [['filet', 'ype'], undefined],
  [['filt', 'er'], undefined],
  [['fin', 'd'], undefined],
  [['fina', 'lly'], undefined],
  [['fini', 'sh'], undefined],
  [['fir', 'st'], undefined],
  [['fo', 'ld'], undefined],
  [['foldc', 'lose'], undefined],
  [['foldd', 'oopen'], undefined],
  [['folddoc', 'losed'], undefined],
  [['foldo', 'pen'], undefined],
  [['for', ''], undefined],
  [['fu', 'nction'], undefined],
  [['g', 'lobal'], undefined],
  [['go', 'to'], GotoCommand.argParser],
  [['gr', 'ep'], GrepCommand.argParser],
  [['grepa', 'dd'], undefined],
  [['gu', 'i'], undefined],
  [['gv', 'im'], undefined],
  [['h', 'elp'], succeed(new HelpCommand())],
  [['ha', 'rdcopy'], undefined],
  [['helpc', 'lose'], undefined],
  [['helpg', 'rep'], undefined],
  [['helpt', 'ags'], undefined],
  [['hi', 'ghlight'], undefined],
  [['hid', 'e'], undefined],
  [['his', 'tory'], HistoryCommand.argParser],
  [['i', 'nsert'], undefined],
  [['ia', 'bbrev'], undefined],
  [['iabc', 'lear'], undefined],
  [['if', ''], undefined],
  [['ij', 'ump'], undefined],
  [['il', 'ist'], undefined],
  [['im', 'ap'], undefined],
  [['imapc', 'lear'], undefined],
  [['ime', 'nu'], undefined],
  [['ino', 'remap'], undefined],
  [['inorea', 'bbrev'], undefined],
  [['inoreme', 'nu'], undefined],
  [['int', 'ro'], undefined],
  [['is', 'earch'], undefined],
  [['isp', 'lit'], undefined],
  [['iu', 'nmap'], undefined],
  [['iuna', 'bbrev'], undefined],
  [['iunme', 'nu'], undefined],
  [['j', 'oin'], undefined],
  [['ju', 'mps'], succeed(new JumpsCommand())],
  [['k', ''], undefined],
  [['kee', 'pmarks'], undefined],
  [['keepa', 'lt'], undefined],
  [['keepj', 'umps'], undefined],
  [['keepp', 'atterns'], undefined],
  [['l', 'ist'], PrintCommand.argParser({ printNumbers: false, printText: true })],
  [['lN', 'ext'], undefined],
  [['lNf', 'ile'], undefined],
  [['la', 'st'], undefined],
  [['lab', 'ove'], undefined],
  [['lad', 'dexpr'], undefined],
  [['laddb', 'uffer'], undefined],
  [['laddf', 'ile'], undefined],
  [['laf', 'ter'], undefined],
  [['lan', 'guage'], undefined],
  [['lat', 'er'], undefined],
  [['lb', 'uffer'], undefined],
  [['lbef', 'ore'], undefined],
  [['lbel', 'ow'], undefined],
  [['lbo', 'ttom'], undefined],
  [['lc', 'd'], undefined],
  [['lch', 'dir'], undefined],
  [['lcl', 'ose'], succeed(new VsCodeCommand('workbench.action.closePanel'))],
  [['lcs', 'cope'], undefined],
  [['ld', 'o'], undefined],
  [['le', 'ft'], LeftCommand.argParser],
  [['lefta', 'bove'], undefined],
  [['let', ''], LetCommand.argParser(false)],
  [['lex', 'pr'], undefined],
  [['lf', 'ile'], undefined],
  [['lfd', 'o'], undefined],
  [['lfir', 'st'], undefined],
  [['lg', 'etfile'], undefined],
  [['lgetb', 'uffer'], undefined],
  [['lgete', 'xpr'], undefined],
  [['lgr', 'ep'], undefined],
  [['lgrepa', 'dd'], undefined],
  [['lh', 'elpgrep'], undefined],
  [['lhi', 'story'], undefined],
  [['ll', ''], undefined],
  [['lla', 'st'], undefined],
  [['lli', 'st'], undefined],
  [['lm', 'ap'], undefined],
  [['lmak', 'e'], undefined],
  [['lmapc', 'lear'], undefined],
  [['ln', 'oremap'], undefined],
  [['lne', 'xt'], succeed(new VsCodeCommand('editor.action.nextCommentThreadAction'))],
  [['lnew', 'er'], undefined],
  [['lnf', 'ile'], undefined],
  [['lo', 'adview'], undefined],
  [['loadk', 'eymap'], undefined],
  [['loc', 'kmarks'], undefined],
  [['lockv', 'ar'], undefined],
  [['lol', 'der'], undefined],
  [['lope', 'n'], succeed(new VsCodeCommand('workbench.action.focusCommentsPanel'))],
  [['lp', 'revious'], succeed(new VsCodeCommand('editor.action.previousCommentThreadAction'))],
  [['lpf', 'ile'], undefined],
  [['lr', 'ewind'], undefined],
  [
    ['ls', ''],
    succeed(new VsCodeCommand('workbench.action.quickOpenLeastRecentlyUsedEditorInGroup')),
  ],
  [['lt', 'ag'], undefined],
  [['lu', 'nmap'], undefined],
  [['lua', ''], undefined],
  [['luad', 'o'], undefined],
  [['luaf', 'ile'], undefined],
  [['lv', 'imgrep'], undefined],
  [['lvimgrepa', 'dd'], undefined],
  [['lw', 'indow'], succeed(new VsCodeCommand('workbench.action.focusCommentsPanel'))],
  [['m', 'ove'], MoveCommand.argParser],
  [['ma', 'rk'], MarkCommand.argParser],
  [['mak', 'e'], undefined],
  [['map', ''], undefined],
  [['mapc', 'lear'], undefined],
  [['marks', ''], MarksCommand.argParser],
  [['mat', 'ch'], undefined],
  [['me', 'nu'], undefined],
  [['menut', 'ranslate'], undefined],
  [['mes', 'sages'], undefined],
  [['mk', 'exrc'], undefined],
  [['mks', 'ession'], undefined],
  [['mksp', 'ell'], undefined],
  [['mkv', 'imrc'], undefined],
  [['mkvie', 'w'], undefined],
  [['mod', 'e'], undefined],
  [['n', 'ext'], undefined],
  [['new', ''], FileCommand.argParsers.new],
  [['nm', 'ap'], undefined],
  [['nmapc', 'lear'], undefined],
  [['nme', 'nu'], undefined],
  [['nn', 'oremap'], undefined],
  [['nnoreme', 'nu'], undefined],
  [['no', 'remap'], undefined],
  [['noa', 'utocmd'], undefined],
  [['noh', 'lsearch'], succeed(new NohlCommand())],
  [['norea', 'bbrev'], undefined],
  [['noreme', 'nu'], undefined],
  [['norm', 'al'], NormalCommand.argParser],
  [['nos', 'wapfile'], undefined],
  [['nu', 'mber'], PrintCommand.argParser({ printNumbers: true, printText: true })],
  [['nun', 'map'], undefined],
  [['nunme', 'nu'], undefined],
  [['ol', 'dfiles'], undefined],
  [['om', 'ap'], undefined],
  [['omapc', 'lear'], undefined],
  [['ome', 'nu'], undefined],
  [['on', 'ly'], succeed(new OnlyCommand())],
  [['ono', 'remap'], undefined],
  [['onoreme', 'nu'], undefined],
  [['opt', 'ions'], undefined],
  [['ou', 'nmap'], undefined],
  [['ounme', 'nu'], undefined],
  [['ow', 'nsyntax'], undefined],
  [['p', 'rint'], PrintCommand.argParser({ printNumbers: false, printText: true })],
  [['pa', 'ckadd'], undefined],
  [['packl', 'oadall'], undefined],
  [['pc', 'lose'], undefined],
  [['pe', 'rl'], undefined],
  [['ped', 'it'], undefined],
  [['perld', 'o'], undefined],
  [['perlf', 'ile'], undefined],
  [['po', 'p'], undefined],
  [['popu', 'p'], undefined],
  [['pp', 'op'], undefined],
  [['pre', 'serve'], undefined],
  [['prev', 'ious'], undefined],
  [['prof', 'ile'], undefined],
  [['profd', 'el'], undefined],
  [['ps', 'earch'], undefined],
  [['pt', 'ag'], undefined],
  [['ptN', 'ext'], undefined],
  [['ptf', 'irst'], undefined],
  [['ptj', 'ump'], undefined],
  [['ptl', 'ast'], undefined],
  [['ptn', 'ext'], undefined],
  [['ptp', 'revious'], undefined],
  [['ptr', 'ewind'], undefined],
  [['pts', 'elect'], undefined],
  [['pu', 't'], PutExCommand.argParser],
  [['pw', 'd'], succeed(new PwdCommand())],
  [['py', 'thon'], undefined],
  [['py3', ''], undefined],
  [['py3d', 'o'], undefined],
  [['py3f', 'ile'], undefined],
  [['pyd', 'o'], undefined],
  [['pyf', 'ile'], undefined],
  [['python3', ''], undefined],
  [['pythonx', ''], undefined],
  [['pyx', ''], undefined],
  [['pyxd', 'o'], undefined],
  [['pyxf', 'ile'], undefined],
  [['q', 'uit'], QuitCommand.argParser(false)],
  [['qa', 'll'], QuitCommand.argParser(true)],
  [['quita', 'll'], QuitCommand.argParser(true)],
  [['r', 'ead'], ReadCommand.argParser],
  [['rec', 'over'], undefined],
  [['red', 'o'], RedoCommand.argParser],
  [['redi', 'r'], undefined],
  [['redr', 'aw'], undefined],
  [['redraws', 'tatus'], undefined],
  [['redrawt', 'abline'], undefined],
  [['reg', 'isters'], RegisterCommand.argParser],
  [['res', 'ize'], undefined],
  [['ret', 'ab'], RetabCommand.argParser],
  [['retu', 'rn'], undefined],
  [['rew', 'ind'], undefined],
  [['ri', 'ght'], RightCommand.argParser],
  [['rightb', 'elow'], undefined],
  [['rsh', 'ada'], undefined],
  [['ru', 'ntime'], undefined],
  [['rub', 'y'], undefined],
  [['rubyd', 'o'], undefined],
  [['rubyf', 'ile'], undefined],
  [['rund', 'o'], undefined],
  [['s', 'ubstitute'], SubstituteCommand.argParser],
  [['sN', 'ext'], undefined],
  [['sa', 'rgument'], undefined],
  [['sal', 'l'], undefined],
  [['san', 'dbox'], undefined],
  [['sav', 'eas'], undefined],
  [['sb', 'uffer'], undefined],
  [['sbN', 'ext'], undefined],
  [['sba', 'll'], undefined],
  [['sbf', 'irst'], undefined],
  [['sbl', 'ast'], undefined],
  [['sbm', 'odified'], undefined],
  [['sbn', 'ext'], undefined],
  [['sbp', 'revious'], undefined],
  [['sbr', 'ewind'], undefined],
  [['scr', 'iptnames'], undefined],
  [['scripte', 'ncoding'], undefined],
  [['scs', 'cope'], undefined],
  [['se', 't'], SetCommand.argParser],
  [['setf', 'iletype'], undefined],
  [['setg', 'lobal'], undefined],
  [['setl', 'ocal'], undefined],
  [['sf', 'ind'], undefined],
  [['sfir', 'st'], undefined],
  [['sh', 'ell'], succeed(new ShCommand())], // Taken from Vim; not in nvim
  [['sig', 'n'], undefined],
  [['sil', 'ent'], undefined],
  [['sl', 'eep'], undefined],
  [['sla', 'st'], undefined],
  [['sm', 'agic'], undefined],
  [['smap', ''], undefined],
  [['smapc', 'lear'], undefined],
  [['sme', 'nu'], undefined],
  [['smile', ''], succeed(new SmileCommand())], // Taken from Vim; not in nvim
  [['sn', 'ext'], undefined],
  [['sno', 'magic'], undefined],
  [['snor', 'emap'], undefined],
  [['snoreme', 'nu'], undefined],
  [['so', 'urce'], undefined],
  [['sor', 't'], SortCommand.argParser],
  [['sp', 'lit'], FileCommand.argParsers.split],
  [['spe', 'llgood'], undefined],
  [['spelld', 'ump'], undefined],
  [['spelli', 'nfo'], undefined],
  [['spellr', 'epall'], undefined],
  [['spellra', 're'], undefined],
  [['spellu', 'ndo'], undefined],
  [['spellw', 'rong'], undefined],
  [['spr', 'evious'], undefined],
  [['sre', 'wind'], undefined],
  [['st', 'op'], undefined],
  [['sta', 'g'], undefined],
  [['star', 'tinsert'], undefined],
  [['startg', 'replace'], undefined],
  [['startr', 'eplace'], undefined],
  [['stj', 'ump'], undefined],
  [['stopi', 'nsert'], undefined],
  [['sts', 'elect'], undefined],
  [['sun', 'hide'], undefined],
  [['sunm', 'ap'], undefined],
  [['sunme', 'nu'], undefined],
  [['sus', 'pend'], undefined],
  [['sv', 'iew'], undefined],
  [['sw', 'apname'], undefined],
  [['sy', 'ntax'], undefined],
  [['sync', 'bind'], undefined],
  [['synti', 'me'], undefined],
  [['t', ''], CopyCommand.argParser],
  [['tN', 'ext'], undefined],
  [['ta', 'g'], undefined],
  [['tab', ''], undefined],
  [['tabN', 'ext'], TabCommand.argParsers.bprev],
  [['tabc', 'lose'], TabCommand.argParsers.tabclose],
  [['tabdo', ''], undefined],
  [['tabe', 'dit'], TabCommand.argParsers.tabnew],
  [['tabf', 'ind'], undefined],
  [['tabfir', 'st'], TabCommand.argParsers.bfirst],
  [['tabl', 'ast'], TabCommand.argParsers.blast],
  [['tabm', 'ove'], TabCommand.argParsers.tabmove],
  [['tabn', 'ext'], TabCommand.argParsers.bnext],
  [['tabnew', ''], TabCommand.argParsers.tabnew],
  [['tabo', 'nly'], TabCommand.argParsers.tabonly],
  [['tabp', 'revious'], TabCommand.argParsers.bprev],
  [['tabr', 'ewind'], TabCommand.argParsers.bfirst],
  [['tabs', ''], undefined],
  [['tags', ''], undefined],
  [['tc', 'd'], undefined],
  [['tch', 'dir'], undefined],
  [['te', 'rminal'], TerminalCommand.argParser],
  [['tf', 'irst'], undefined],
  [['th', 'row'], undefined],
  [['tj', 'ump'], undefined],
  [['tl', 'ast'], undefined],
  [['tm', 'enu'], undefined],
  [['tma', 'p'], undefined],
  [['tmapc', 'lear'], undefined],
  [['tn', 'ext'], undefined],
  [['tno', 'remap'], undefined],
  [['to', 'pleft'], undefined],
  [['tp', 'revious'], undefined],
  [['tr', 'ewind'], undefined],
  [['try', ''], undefined],
  [['ts', 'elect'], undefined],
  [['tu', 'nmenu'], undefined],
  [['tunma', 'p'], undefined],
  [['u', 'ndo'], UndoCommand.argParser],
  [['una', 'bbreviate'], undefined],
  [['undoj', 'oin'], undefined],
  [['undol', 'ist'], undefined],
  [['unh', 'ide'], undefined],
  [['unl', 'et'], UnletCommand.argParser],
  [['unlo', 'ckvar'], undefined],
  [['unm', 'ap'], undefined],
  [['unme', 'nu'], undefined],
  [['uns', 'ilent'], undefined],
  [['up', 'date'], WriteCommand.argParser],
  [['v', 'global'], undefined],
  [['ve', 'rsion'], undefined],
  [['verb', 'ose'], undefined],
  [['vert', 'ical'], undefined],
  [['vi', 'sual'], undefined],
  [['vie', 'w'], undefined],
  [['vim', 'grep'], GrepCommand.argParser],
  [['vimgrepa', 'dd'], undefined],
  [['viu', 'sage'], undefined],
  [['vm', 'ap'], undefined],
  [['vmapc', 'lear'], undefined],
  [['vme', 'nu'], undefined],
  [['vn', 'oremap'], undefined],
  [['vne', 'w'], FileCommand.argParsers.vnew],
  [['vnoreme', 'nu'], undefined],
  [['vs', 'plit'], FileCommand.argParsers.vsplit],
  [['vsc', 'ode'], VsCodeCommand.argParser], // Special: run VS Code command
  [['vu', 'nmap'], undefined],
  [['vunme', 'nu'], undefined],
  [['w', 'rite'], WriteCommand.argParser],
  [['wN', 'ext'], undefined],
  [['wa', 'll'], WallCommand.argParser],
  [['wh', 'ile'], undefined],
  [['wi', 'nsize'], undefined],
  [['winc', 'md'], undefined],
  [['windo', ''], undefined],
  [['winp', 'os'], undefined],
  [['wn', 'ext'], undefined],
  [['wp', 'revious'], undefined],
  [['wq', ''], WriteQuitCommand.argParser],
  [['wqa', 'll'], WriteQuitAllCommand.argParser],
  [['wsh', 'ada'], undefined],
  [['wu', 'ndo'], undefined],
  [['x', 'it'], WriteQuitCommand.argParser],
  [['xa', 'll'], WriteQuitAllCommand.argParser],
  [['xm', 'ap'], undefined],
  [['xmapc', 'lear'], undefined],
  [['xme', 'nu'], undefined],
  [['xn', 'oremap'], undefined],
  [['xnoreme', 'nu'], undefined],
  [['xu', 'nmap'], undefined],
  [['xunme', 'nu'], undefined],
  [['y', 'ank'], YankCommand.argParser],
  [['z', ''], undefined],
  [['~', ''], undefined],
];

class UnimplementedCommand extends ExCommand {
  name: string;

  public override neovimCapable(): boolean {
    // If the user has neovim integration enabled, don't stop them from using these commands
    return true;
  }

  constructor(name: string) {
    super();
    this.name = name;
  }

  async execute(vimState: VimState): Promise<void> {
    StatusBar.setText(
      vimState,
      `Command :${this.name} is not yet implemented (PRs are welcome!)`,
      true,
    );
  }

  override async executeWithRange(vimState: VimState, range: LineRange): Promise<void> {
    await this.execute(vimState);
  }
}

export class NoOpCommand extends ExCommand {
  async execute(vimState: VimState): Promise<void> {
    // nothing
  }
}

function nameParser(
  name: [string, string],
  argParser: ArgParser | undefined,
): Parser<Parser<ExCommand>> {
  argParser ??= all.result(new UnimplementedCommand(name[1] ? `${name[0]}[${name[1]}]` : name[0]));

  const fullName = name[0] + name[1];
  const p = nameAbbrevParser(name[0], name[1]).result(argParser);
  return fullName === '' || /[a-z]$/i.test(fullName) ? p.notFollowedBy(regexp(/[a-z]/i)) : p;
}

export const commandNameParser: Parser<Parser<ExCommand> | undefined> = alt(
  ...[...builtinExCommands]
    .reverse()
    .map(([name, argParser]) => nameParser(name, argParser?.skip(optWhitespace))),
);

export const exCommandParser: Parser<{ lineRange: LineRange | undefined; command: ExCommand }> =
  optWhitespace
    .then(string(':').skip(optWhitespace).many())
    .then(
      seq(
        LineRange.parser.fallback(undefined),
        optWhitespace,
        commandNameParser.fallback(undefined),
        all,
      ),
    )
    .map(([lineRange, whitespace, parseArgs, args]) => {
      if (parseArgs === undefined) {
        throw VimError.fromCode(
          ErrorCode.NotAnEditorCommand,
          `${lineRange?.toString() ?? ''}${whitespace}${args}`,
        );
      }
      const result = seq(parseArgs, optWhitespace.then(all)).parse(args);
      if (result.status === false) {
        if (result.index.offset === args.length) {
          throw VimError.fromCode(ErrorCode.ArgumentRequired);
        }
        throw VimError.fromCode(ErrorCode.InvalidArgument474);
      }
      if (result.value[1]) {
        // TODO: Implement `:help :bar`
        // TODO: Implement `:help :comment`
        throw VimError.fromCode(ErrorCode.TrailingCharacters, result.value[1]);
      }
      return { lineRange, command: result.value[0] };
    });
