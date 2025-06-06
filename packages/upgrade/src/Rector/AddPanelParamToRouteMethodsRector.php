<?php

namespace Filament\Upgrade\Rector;

use PhpParser\Node;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Name\FullyQualified;
use PHPStan\Analyser\Scope;
use Rector\NodeTypeResolver\Node\AttributeKey;
use Rector\PhpParser\Node\BetterNodeFinder;
use Rector\Rector\AbstractRector;
use Symplify\RuleDocGenerator\ValueObject\CodeSample\CodeSample;
use Symplify\RuleDocGenerator\ValueObject\RuleDefinition;

class AddPanelParamToRouteMethodsRector extends AbstractRector
{
    private BetterNodeFinder $betterNodeFinder;

    public function __construct(BetterNodeFinder $betterNodeFinder)
    {
        $this->betterNodeFinder = $betterNodeFinder;
    }

    public function getRuleDefinition(): RuleDefinition
    {
        return new RuleDefinition(
            'Add `Filament::getCurrentOrDefaultPanel()` to static method calls to getRoutePath() and getRelativeRouteName()',
            [
                new CodeSample(
                    'Page::getRoutePath();',
                    'Page::getRoutePath(Filament\Facades\Filament::getCurrentOrDefaultPanel());'
                ),
            ]
        );
    }

    public function getChanges(): array
    {
        return [
            'getRoutePath',
            'getRelativeRouteName',
            'getRoutePrefix',
            'prependClusterRouteBaseName',
            'prependClusterSlug',
        ];
    }

    public function getNodeTypes(): array
    {
        return [StaticCall::class];
    }

    public function refactor(Node $node): ?Node
    {
        if (! $node instanceof StaticCall) {
            return null;
        }

        if (! in_array($node->name->name, $this->getChanges())) {
            return null;
        }

        // Only act on static calls with no arguments...
        if (count($node->args) > 0) {
            return null;
        }
	    
		$scope = $node->getAttribute(AttributeKey::SCOPE);
		
		$panelVariableExistsInScope = false;
		
		if ($scope instanceof Scope) {
			$panelVariableExistsInScope = in_array('panel', $scope->getDefinedVariables());
		}
		
        if ($panelVariableExistsInScope) {
            // Use the existing $panel variable
            $node->args[] = new Node\Arg(new Variable('panel'));
        } else {
            // Fall back to Filament::getCurrentOrDefaultPanel()
            $filamentCall = new StaticCall(new FullyQualified('Filament\Facades\Filament'), 'getCurrentOrDefaultPanel');
			
            $node->args[] = new Node\Arg($filamentCall);
        }

        return $node;
    }
}
